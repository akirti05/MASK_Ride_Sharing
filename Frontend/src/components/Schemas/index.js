import * as Yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
// matches 6 chars,1 upper case , 1 lower case , 1 numeric digit

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a Valid Email")
    .required("Email is Required"),
  password: Yup.string()
    // .min(6)
    // .matches(passwordRules, {
    //   message: "please create a strong password",
    // })
    .required("Password is Required"),
});

// Create the SignupSchema using Yup

export const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  phone: Yup.string().required("Phone number is required"),

  password: Yup.string().required("Password is required"),
});
