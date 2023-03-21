import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    address_line1: Yup.string()
      .required("Please enter address line 1")
      .matches(/.*\S.*/, "Only space not allowed"),
    postal_code: Yup.string()
      .required("Please enter postal code")
      .matches(/^[0-9]*$/, "Please enter valid postal code"),
    city: Yup.string()
      .required("Please enter city")
      .matches(/.*\S.*/, "Only space not allowed"),
    state: Yup.string()
      .required("Please enter state")
      .matches(/.*\S.*/, "Only space not allowed")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    username: "",
    email: "",
    companyname: "",
    password: "",
    phone: "",
    brandcolor: "#0000ff",
    logo: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    city: "",
    state: ""
  }),
  handleSubmit: async values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
