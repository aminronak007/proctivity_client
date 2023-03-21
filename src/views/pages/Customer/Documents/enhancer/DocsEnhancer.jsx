import { withFormik } from "formik";
import * as Yup from "yup";

Yup.addMethod(Yup.array, "unique", function(message) {
  return this.test("unique", message, function(list) {
    let fileArr = Array.from(list);

    if (
      fileArr.every(x =>
        [
          "jpg",
          "jpeg",
          "png",
          "webp",
          "gif",
          "pdf",
          "doc",
          "docx",
          "csv"
        ].includes(
          x.name
            .split(".")
            .pop()
            .toLowerCase()
        )
      )
    ) {
      return true;
    } else {
      return this.createError({
        path: `customer_docs`,
        message: message
      });
    }
  });
});

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    customer_docs: Yup.array()
      .min(1, "Please select any file")
      .unique("Please select a valid file type.")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    customer_docs: []
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
