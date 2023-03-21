import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    stripe_public_key: Yup.string()
      .required("Please enter stripe public key")
      .matches(/.*\S.*/, "Only space not allowed"),
    stripe_secret_key: Yup.string()
      .required("Please enter stripe private key")
      .matches(/.*\S.*/, "Only space not allowed")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    stripe_public_key: "",
    stripe_secret_key: ""
  }),
  handleSubmit: async values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
