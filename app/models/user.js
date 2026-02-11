import {default as mongoose} from 'mongoose'


const userSchema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String, required: true, unique: true, lowercase: true},
    mobile: {type: String, required: true, unique: true},
    roles: {type: [String], default: ["USER"]},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    profile_image: {type: String, required: false},
    skills: {type: [String], default: []},
    age: {type: Number},
    national_code: {type: String, unique: true, sparse: true},
    birth_date: {type: Date},
    education_degree: {
        type: String, enum: ["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "MASTER", "PHD", "OTHER"], default: "BACHELOR"
    },
//HIGH_SCHOOL → دیپلم
// ASSOCIATE → کاردانی
// BACHELOR → کارشناسی
// MASTER → کارشناسی ارشد
// PHD → دکترا
// OTHER → سایر موارد
    field_of_study: {type: String},
    marital_status: {type: String, enum: ["single", "married", "divorced"]},
    number_of_children: {type: Number, default: 0},
    work_experience_years: {type: Number, default: 0},
    insurance_experience_years: {type: Number, default: 0},
    contract_type: {
        type: String, enum: ["FULL_TIME", "PART_TIME", "CONTRACTOR", "INTERN"], default: "FULL_TIME"
    },

    token: {type: String, default: ""},
}, {timestamps: true})
const userModel = mongoose.model('users', userSchema)
export default userModel