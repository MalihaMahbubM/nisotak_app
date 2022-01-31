import React, { Component } from "react";
import APIInterface from "../../MultipleChoiceQuestion/APIInterface";
let previewUrls = new WeakMap();

let blobUrl = (blob) => {
    if (previewUrls.has(blob)) {
        return previewUrls.get(blob);
    } else {
        let url = URL.createObjectURL(blob);
        previewUrls.set(blob, url);
        return url;
    }
};

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.onChangeFile = this.onChangeFile.bind(this);
        this.onClickDeleteFile = this.onClickDeleteFile.bind(this);

        this.state = {
            audioFilePreview: null,
            audioPreviewOriginalFileName: "",
            audioPreviewMimeType: "",
            audioProps: props.audioProps,
            audioBlob:null,
            hasAudio:false,
            tryGet:true,
        };
    }

    onChangeFile = (e) => {

    };

    getMimeTypeFromFileName(file_name) {
        let nameSplit = file_name.split(".");
        let fileExtension = nameSplit.pop();
        let mimeType = undefined;
        if (fileExtension === "mp3") {
            mimeType = "audio/mpeg";
        }
        return mimeType;
    }

    async loadAudioPreview(){

    }

    async onClickDeleteFile() {
    }

    async getAudioAPICall(){
        let response = await APIInterface.downloadAudio(this.props.audioProps);
        if(response.errorStatus === undefined){
            this.setState({hasAudio: true});
            let blob = new Blob([response.data], {type:"mp3"});
            this.setState({audioBlob:blob})

        } else {
            console.error(`Failed to get Audio: ${response.errorStatus}`);
            this.setState({hasAudio: false,tryGet:false});
        }
        return response;
    }

    render() {
        let noAttemptToGetAudio = (this.state.hasAudio === false && this.state.tryGet === true)
        let audioNowUpdated = (this.state.hasAudio === false && this.props.file_name !== "None");
        if(noAttemptToGetAudio || audioNowUpdated) {
            this.getAudioAPICall().catch(err => {
                console.error(`Failed to get Audio: ${err}`)
            });
        }
        let {audioBlob} = this.state
        let audioUrl = audioBlob && blobUrl(audioBlob)
        return (
            <>
                <div className="form-group col-md-6">
                    {audioBlob !== null && (
                        <audio src={audioUrl} controls={true}> </audio>
                    )}
                <label>
                    {this.props.file_name}
                </label>
                </div>
            </>
        );
    }
}
