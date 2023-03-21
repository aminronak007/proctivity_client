import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    cardname: Yup.string()
      .trim()
      .required("Please enter card name"),
    cardnumber: Yup.string()
      .min(16, "Card Number must be at least 16 characters")
      .max(16, "Card Number must be at least 16 characters")
      .matches(/^[0-9]*$/, "Please enter valid card number")
      .trim()
      .required("Please enter card number"),
    expirydate: Yup.string()
      .trim()
      .required("Please select date"),
    cvv: Yup.string()
      .min(3)
      .max(3)
      .matches(/^[0-9]*$/, "Please enter valid cvv")
      .trim()
      .required("Please enter cvv"),
    autoRenew: Yup.bool().required()
  }),
  mapPropsToValues: props => ({
    cardname: "",
    cardnumber: "",
    expirydate: undefined,
    cvv: "",
    autoRenew: true
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
