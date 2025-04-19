import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'กรุณาระบุชื่อ'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'กรุณาระบุอีเมล'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'รูปแบบอีเมลไม่ถูกต้อง',
    ],
  },
  password: {
    type: String,
    required: [true, 'กรุณาระบุรหัสผ่าน'],
    minlength: [6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

// ไม่ส่งรหัสผ่านกลับไปในการ query
UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User; 