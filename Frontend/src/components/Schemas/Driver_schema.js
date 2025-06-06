import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Please select gender').required("Gender is required"),
  vehicle_type: Yup.string().oneOf(['car', 'bike'], 'Please select vehicle type').required("Vehicle type is required"),
  model: Yup.string().required("Vehicle model is required"),
  vehicle_number: Yup.string().required("Vehicle number is required"),
  phone: Yup.string().required("Phone is required"),
});
