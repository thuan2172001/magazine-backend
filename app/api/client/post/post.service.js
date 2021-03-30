import {parsePaginationOption, SumOption} from '../../library/search';
import Post from '../../../models/post';
import User from '../../../models/user';
import {getSearchOption, mergeSearchObjToPopulate, poppulate} from '../../library/new-search';
import {validateInputString} from '../../../utils/validate-utils';
import {saveImageAndGetHash, saveImageAndGetHashList} from '../../../utils/image-utils';
import {saveFileAndGetHash, saveFileAndGetHashList} from "../../../utils/upload-file-utils";
import Faculty from "../../../models/faculty";
import AcademicYear from "../../../models/academic_year";
import Category from "../../../models/category";
import {sendEmail} from "../nodemailer/mail.service";

const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const CODE_NOT_FOUND = 'POST.ERROR.CODE_NOT_FOUND';

export const getAll = async (args = {}, authId) => {
    const defaultSortField = 'updatedAt';
    const searchModel = {
        category: {_id: 'objectId'},
        title: 'string',
        user: {_id: 'objectId', faculty: {_id: 'objectId'}},
        code: 'string',
        date_upload: 'date-time',
        status: 'string',
        academicYear: {_id: 'objectId'},
    };

    const poppulateObj = {
        category: {__from: 'categories'},
        academicYear: {__from: 'academicyears'},
        user: {
            __from: 'users',
            faculty: {__from: 'faculties'},
        },
    };
    const user = await User.findOne({_id: authId}).populate(['role']);
    let vArgs = args
    if (user.role.role === 'student')
         vArgs = {...args, 'user._id': authId};
    else if (user.role.role === 'coordinator')
         vArgs = {...args, 'user.faculty._id': user.faculty}
    else if (['manager', 'admin', 'guest'].includes(user.role.role))
        vArgs = {...args, status: 'accept'}
    const validSearchOption = getSearchOption(vArgs, searchModel);
    mergeSearchObjToPopulate(validSearchOption, poppulateObj, searchModel, vArgs);
    const paginationOption = parsePaginationOption(args);
    // eslint-disable-next-line no-nested-ternary
    const sortOption = {[args.sortBy ? args.sortBy === '' ? defaultSortField : args.sortBy : defaultSortField]: args.sortType === 'asc' ? 1 : -1};
    const {page, limit} = paginationOption;
    const skipOptions = limit * (page - 1);

    const [pop] = poppulate(poppulateObj);
    const query = await Post
        .aggregate([...pop, {$sort: sortOption}, {$skip: skipOptions}, {$limit: limit}])
        .collation({
            locale: 'vi',
            numericOrdering: true,
        });

    // const user = await User.findOne({_id: _id})
    // console.log(user)
    // var newQuery = query;
    // console.log(newQuery)
    // if (user.role === 'student')
    //     newQuery = query.filter(item => item.user._id === _id)
    // else if (user.role === 'coordinator')
    //     newQuery = query.filter(item => item.user.faculty.faculty
    //         === user.faculty.faculty)
    //
    // console.log(newQuery)
    const total = await Post.aggregate([...pop, SumOption]);
    return {
        data: query,
        paging: {page, limit, total: total.length === 0 ? 0 : total[0].n},
    };
};

export const create = async (args = {}) => {
    const validateArgs = async (arg = {}) => {
        const {
            title,
            category,
            description,
            image,
            file,
          condition,
        } = arg;

        if (validateInputString(title)) throw new Error('POST.ERROR.CREATE.INVALID_TITLE');
        if (condition !== '1') throw new Error('POST.ERROR.CREATE.NEED_TO_CONFIRM_TERMS')
        return {
            title,
            user,
            category,
            description,
            image,
            file,
            code,
        };
    };

    const {
        title,
        category,
        user,
        description,
        image,
        file,
        code,
    } = await validateArgs(args);
    let savedImage = null;
    if (image) {
        savedImage = await saveImageAndGetHashList(image);
    }

    let saveFile = null;
    if (file) {
        saveFile = await saveFileAndGetHash(file);
    }

    const checkUser = await User.findOne({_id: args.userInfo._id}).populate(
        ['role', 'faculty']
    );
    if (checkUser.role.role !== 'student' && checkUser.role.role !== 'admin')
        throw new Error('POST.ERROR.CREATE.YOU_ARE_NOT_STUDENT')

    const checkAcademicYear = await AcademicYear.findOne({status: 'Active'})
    console.log(checkAcademicYear)

    if (!checkAcademicYear) throw new Error('POST.ERROR.CREATE.NULL_ACTIVE_ACADEMIC_YEAR')
    const ClosureDate = checkAcademicYear.closureDate
    const today = new Date()
    const diffTime = ClosureDate.getTime() - today.getTime()
    if (diffTime <= 0) throw new Error('POST.ERROR.CREATE.TIME_OUT')


    // if (!user.faculty) throw  new Error('POST.ERROR.CREATE.INSUFFICIENT_DATA');
    const checkCategory = await Category.findOne({_id: category._id});
    if (!checkCategory) throw  new Error('POST.ERROR.CREATE.CANNOT_FIND_CATEGORY');

    try {
        const newData = new Post({
            title,
            user: checkUser,
            code,
            date_upload: new Date(),
            category: checkCategory,
            academicYear: checkAcademicYear,
            image: savedImage,
            file: saveFile,
            description,
            status: 'pending'
        });
        sendEmail('thuan2172001@gmail.com', 'Trinh Van Thuan', 'postCreated');
        sendEmail('phamdat128@gmail.com', 'Phạm Đạt', 'postCreated');
        const coordinatorUser = await User.findOne({_id: checkUser.faculty.user})
        if (coordinatorUser) sendEmail(coordinatorUser.email, coordinatorUser.fullName, 'postCreated');
        const data = await newData.save();
        return data;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const update = async (args = {}) => {
    const validateArgs = async (arg = {}) => {
        const {
            title,
            category,
            description,
            image,
            file,
            condition,
        } = arg;

        if (validateInputString(title)) throw new Error('POST.ERROR.CREATE.INVALID_TITLE');
        if (condition !== '1') throw new Error('POST.ERROR.CREATE.NEED_TO_CONFIRM_TERMS')
        return {
            title,
            user,
            category,
            description,
            image,
            file,
            code,
        };
    };

    const {
        title,
        category,
        user,
        description,
        image,
        file,
        code,
    } = await validateArgs(args);

    const checkAcademicYear = await AcademicYear.findOne({status: 'Active'})
    const FinalClosureDate = checkAcademicYear.finalClosureDate
    const today = new Date()
    const diffTime = FinalClosureDate.getTime() - today.getTime()
    if (diffTime <= 0) throw new Error('POST.ERROR.EDIT.TIME_OUT')

    const data = await Post.findOne({_id: args.postId});
    console.log(data)
    console.log(args)
    if (!data) throw new Error('POST.ERROR.NOT_FOUND');
    const {userInfo} = args;
    const listFiled = [
        'title',
        'category',
        'description',
        'status',
    ];
    // const user = await User.findOne({_id: userInfo._id}).populate([
    //     {path: 'user'}
    // ]);
    // if (!user.faculty) throw  new UError('POST.ERROR.UPDATE.INSUFFICIENT_DATA');
    // if(!user._id.equals(data)) throw new Error('POST.ERROR.UPDATE.THIS_USER_IS_NOT_AUTHOR');
    // if(!user.faculty.equals(data)) throw new Error('POST.ERROR.UPDATE.THIS_USER_IS_NOT_IN_ORIGIN_FACULTY');
    listFiled.forEach((fieldName) => {
        data[fieldName] = args[fieldName] ?? data[fieldName];
    });

    if (args.image) {
        data.image = await saveImageAndGetHashList(args.image);
    }

    if (args.file) {
        data.file = await saveFileAndGetHash(args.file);
    }

    try {
        const newData = await data.save();
        return newData;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const getById = async (args = {}) => {
    const {postId} = args;

    try {
        const result = await Post.findOne({_id: postId})
            .populate([
                {
                    path: 'category',
                },
                {
                    path: 'academicYear',
                },
                {
                    path: 'user',
                    populate: 'faculty',
                },
                {
                    path: 'comments',
                    select: [
                        'fullName',
                    ],
                    populate: {
                        path: 'createdBy',
                        select: ['fullName'],
                    },
                }
            ]);
        return result;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const removeById = async (args = {}) => {
    const checkUser = await User.findOne({_id: args.userInfo._id}).populate(
        ['role']
    );
    if (checkUser.role.role === 'guest')
        throw new Error('POST.ERROR.DELETE.INSUFFICIENT_AUTHORITY')
    const data = await Post.findOne({_id: args.postId});
    if (!data) throw new Error('POST.ERROR.NOT_FOUND');
    if(!data.user._id.equals(checkUser._id) && checkUser.role.role === 'student')
        throw new Error('POST.ERROR.DELETE.INSUFFICIENT_AUTHORITY')
    try {
        if (data) return await Post.findOneAndDelete({_id: data._id});
        else throw new Error('DELETE.ERROR.CANT_DELETE_STORE_LEVEL');
    } catch (err) {
        throw new Error(err.message);
    }
};

export const remove = async (args = {}) => {
    const validateArgs = async (arg = {}) => {

        if (!Array.isArray(arg) && arg.length === 0) throw new Error('DELETE.ERROR.POST.POST');
        return arg;
    };
    const checkUser = await User.findOne({_id: args.userInfo._id}).populate(
        ['role']
    );
    if (checkUser.role.role === 'guest')
        throw new Error('POST.ERROR.DELETE.INSUFFICIENT_AUTHORITY')

    const listRemoveData = await validateArgs(args.data);
    console.log(listRemoveData)


    try {
        let result = await Promise.all(listRemoveData.map(async (dataId) => {
            console.log(dataId.user._id)
            if (!checkUser._id.equals(dataId.user._id) && checkUser.role.role === 'student')
                throw new Error('POST.ERROR.DELETE.INSUFFICIENT_AUTHORITY')
            if (!await Post.findOneAndDelete({
                _id: dataId,
            })) return {message: 'DELETE.ERROR.POST.CANNOT_DELETE', additional: dataId};
            return null;
        }));
        result = result.filter((r) => r != null);
        if (result.length > 0) {
            throw new Error(`${JSON.stringify(result)}`);
        }
        return listRemoveData;
    } catch (err) {
        throw new Error(err.message);
    }
};
