import React from "react";
import { TransparentButton } from "../Buttons";

export const UploadFileSection = (props) => {
  if (props.hide) return <></>;

  return (
    <input
      type="file"
      name="file"
      className="form-control-file"
      onChange={props.onChangeFunction}
    />
  );
};

export const ShowCurrentFile = (props) => {
  if (props.children === undefined) return <></>;

  return (
    <p>
      Current file: <i>{props.children.file_name}</i>
    </p>
  );
};

export const AudioOptions = (props) => {
  if (props.children === undefined) return <></>;
  if (props.showOptions === false) return <></>;

  return (
    <div className="form-row ">
      <TransparentButton onClick={props.onClickDownload}>
        {props.downloadButtonText}
      </TransparentButton>
      <TransparentButton onClick={props.onclickUploadFile}>
        {props.uploadFileButtonText}
      </TransparentButton>
      <TransparentButton onClick={props.onClickDeleteFile}>
        {props.deleteButtonText}
      </TransparentButton>
    </div>
  );
};
