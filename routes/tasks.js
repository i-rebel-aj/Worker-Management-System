const express=require("express")
const router=express.Router();
const {renderTaskform, addTask, displayEditTaskform, editTask, markCompleted, addSubmission, deleteTask, displaySubmissionPage}=require('../controllers/task')
const {isManager, isWorker}=require('../middlewares/authorization')
const {isLoggedIn}=require('../middlewares/authentication')
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});
const  upload = multer({ storage: storage })

router.get('/:id/submission', [isLoggedIn, isManager], displaySubmissionPage)

router.post('/:id/submission', [isLoggedIn, isWorker, upload.single('submission_image')], addSubmission)

router.get('/', [isLoggedIn, isManager], renderTaskform)
router.post('/',[isLoggedIn, isManager] ,addTask)
router.get('/:id/edit',[isLoggedIn, isManager], displayEditTaskform)
router.put('/:id',[isLoggedIn, isManager],editTask)
router.post('/:id/complete', [isLoggedIn, isManager], markCompleted)
router.delete('/:id', [isLoggedIn, isManager], deleteTask)


module.exports=router