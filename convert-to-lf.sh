git config core.eol lf
git config core.autocrlf input
git config --global core.eol lf
git config --global core.autocrlf input
git checkout-index --force --all
git rm --cached -r .
git reset --hard