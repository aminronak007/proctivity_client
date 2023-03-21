import { withFormik } from "formik";
import * as Yup from "yup";

Yup.addMethod(Yup.array, "unique", function(message) {
  return this.test("unique", message, function(list) {
    if (list?.length > 0) {
      if (
        ["jpg", "jpeg", "png"].includes(
          list[0]?.name
            .split(".")
            .pop()
            .toLowerCase()
        )
      ) {
        var numb = list[0].size / 1024 / 1024;
        numb = numb.toFixed(2);
        if (numb > 10) {
          return this.createError({
            path: `logo`,
            message:
              "Maximum filesize is 10 mb. Your file size is: " + numb + " MiB"
          });
        }
        return true;
      } else {
        return this.createError({
          path: `logo`,
          message: message
        });
      }
    }
  });
});

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
      .required("Please enter company name"),
    email: Yup.string()
      .email("The email you have entered is invalid")
      .max(60)
      .required("Please enter email"),
    password: Yup.string()
      .min(8)
      .max(16)
      .required("Please enter password"),
    phone: Yup.string()
      .min(9, "Please enter a valid mobile number")
      .max(10, "Please enter a valid mobile number")
      .matches(/^[0-9]*$/, "Please enter valid mobile number")
      .required("Please enter mobile number"),
    // brandcolor: Yup.string().required("Please choose a brand color"),
    // logo: Yup.string().required("Please add a logo image"),
    logo: Yup.array()
      .required("Please add a logo image")
      .unique("Please select a valid file image."),
    address_line1: Yup.string()
      .required("Please enter address")
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
    // brandcolor: "#ffffff",
    logo: "",
    address_line1: "",
    postal_code: "",
    city: "",
    state: ""
  }),
  handleSubmit: async values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
