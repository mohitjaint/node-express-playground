import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
    patient :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Patient',
        required : true
    },
    doctor : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Doctor',
        required : true
    },
    diagnosis : {
        type : String,
        required : true
    },
    treatment : {
        type : String,
        required : true
    },
    dateOfVisit : {
        type : Date,
        required : true
    }
}, {timestamps: true});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;