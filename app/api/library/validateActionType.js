const ACTION_TYPE_NOT_FOUND = 'VALIDATE.ERROR.ACTION_TYPE_NOT_FOUND';
const INVALID_ACTION_TYPE = 'VALIDATE.ERROR.INVALID_ACTION_TYPE';

const ValidateActionType = (args = {}) => {
  const { actionType, realMethod } = args;

  if (typeof actionType !== 'string' || actionType.length === 0) {
    throw new Error(ACTION_TYPE_NOT_FOUND);
  }
  if (actionType.trim().toLowerCase() !== realMethod.toLowerCase()) {
    throw new Error(INVALID_ACTION_TYPE);
  }

  return true;
};

export default ValidateActionType;
