import React, { Fragment } from "react";
import { Modal, ModalBody } from "reactstrap";
import Dropzone from "react-dropzone";

const ProfileUploaderDialog = props => {
  const {
    modal,
    setmodal,
    className,
    acceptedFile,
    uploadedFileDetail,
    maxSize,
    uploadFileHandler,
    resetUploadDialog
  } = props;

  var allowedExtensions = ["jpg", "png", "jpeg"];

  return (
    <Modal
      centered
      isOpen={modal}
      toggle={setmodal}
      className={className}
      size="lg"
      fade={false}
    >
      <ModalBody>
        <Fragment>
          {uploadedFileDetail ? (
            <div className="drag-drop-area flex-x center whitelight fill-height">
              <img
                style={{
                  maxHeight: "500px",
                  objectFit: "contain"
                }}
                className="fill-width"
                src={uploadedFileDetail.thumb}
                alt="thumb"
              />
            </div>
          ) : (
            <Dropzone
              onDrop={acceptedFiles => acceptedFile(acceptedFiles)}
              accept=".jpg,.jpeg,.png"
              minSize={0}
              maxSize={maxSize}
              multiple={false}
            >
              {({
                getRootProps,
                getInputProps,
                isDragReject,
                rejectedFiles
              }) => {
                const isFileTooLarge =
                  rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
                const isFileValid =
                  rejectedFiles.length > 0 &&
                  !allowedExtensions.includes(
                    rejectedFiles[0].name.split(".").pop()
                  );
                return (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="drag-drop-area flex-x center whitelight">
                      <div>
                        <div className="an-16 demi-bold-text accent3--text">
                          Drag 'n' drop photo here, or click to select Photo
                        </div>
                        <div className="an-16 demi-bold-text warning--text text-center pt20">
                          {isDragReject &&
                            "We reject your file please select only one file or valid file type, sorry!"}
                          {isFileTooLarge && (
                            <div className="text-danger mt-2">
                              File is too large.
                            </div>
                          )}
                          {isFileValid && (
                            <div className="text-danger mt-2">
                              Only allowed .jpg, .jpeg, .png.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Dropzone>
          )}
        </Fragment>
        <div className="flex-x pt-4 center">
          <button
            className="btn btn-blue mr-3"
            onClick={uploadFileHandler}
            disabled={uploadedFileDetail ? null : "disabled"}
          >
            Upload
          </button>
          <button
            className="btn btn-bordered"
            onClick={() => resetUploadDialog(false)}
          >
            Cancel
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ProfileUploaderDialog;
