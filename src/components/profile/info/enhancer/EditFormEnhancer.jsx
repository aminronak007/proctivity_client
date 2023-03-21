import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .max(20)
      .matches(/^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/, "Please enter valid username")
      .required("Please enter username"),
    companyname: Yup.string()
      .max(60)
      .matches(
        /^[a-zA-Z0-9][a-zA-Z 0-9]*[a-zA-Z0-9]$/,
        "Please enter valid company name"
      )
      .trim()
      .required("Please enter company name"),
    email: Yup.string()
      .email("The Email Id you have entered is invalid")
      .max(60)
      .trim()
      .required("Please enter email"),
    phone: Yup.string()
      .min(9, "Please enter a valid mobile number")
      .max(10, "Please enter a valid mobile number")
      .matches(/^[0-9]*$/, "Please enter valid mobile number")
      .required("Please enter mobile number"),
    brandcolor: Yup.string().required("Please select brandcolor"),
    logo: Yup.string().required("Please enter company logo"),
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
