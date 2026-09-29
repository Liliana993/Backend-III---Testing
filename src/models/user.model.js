import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { USER_ROLE } from "../constants/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true
    },

    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"]
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.CUSTOMER
    },

    documents: {
      type: [
        {
          name: {
            type: String
          },
          reference: {
            type: String
          }
        }
      ],
      default: []
    },
    isAvailable: {
    type: Boolean,
    default: true
   }
  },
  {
    timestamps: true
  }
);

// Encriptar contraseña antes de guardar
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;