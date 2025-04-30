import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {//this is call backs
      cb(null, './public/temp')//here its store the uploaded path of file
    },
    filename: function (req, file, cb) {//this is also call back which return file name
      cb(null, file.originalname)//yha par file.original name return me mil gaya
    }
  })
  
export const upload = multer({ storage, })//this multer use as a middleware in routing 