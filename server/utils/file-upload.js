const multer = require('multer');
const path = require('path');

const createFileFilter = (extensions = []) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).substr(1).toLowerCase();
    if (! extensions.includes(ext))
      return cb(new Error('Incorrect filetype ('+ext+'). Allowed filetype(s): ' + extensions.join(', '), 400));
    return cb(null, true);
  };
};

module.exports = (options = {}) => {
  const config = {
    dest: path.join(process.cwd(), './upload')
  };
  if (options.ext)
    config.fileFilter = createFileFilter(options.ext);
  
  if (options.dest)
    config.dest = options.dest;
  
  if (options.maxFileSize)
    config.limits = {fieldSize: options.maxFileSize};
  
  return multer(config).any();
};
