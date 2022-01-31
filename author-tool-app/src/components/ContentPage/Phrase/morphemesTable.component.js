import React, { Component } from "react";
import { TabbleButton, TransparentButton } from "../../Utils/Buttons";
import ConfirmDelete from "../../Utils/confirmDelete.component";
import {Button, ButtonGroup} from "react-bootstrap";
import {ArrowDown, ArrowUp} from 'react-bootstrap-icons'

export default class MorphemesTable extends Component {
  constructor(props) {
    super(props);

    this.updateParentState = this.updateParentState.bind(this);
    this.onChangeMorphemePosition = this.onChangeMorphemePosition.bind(this);
    this.onChangeMorphemeCree = this.onChangeMorphemeCree.bind(this);
    this.onChangeMorphemeEnglish = this.onChangeMorphemeEnglish.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onClickDeleteMorpheme = this.onClickDeleteMorpheme.bind(this);
    this.closeDeleteConfirmationModal = this.closeDeleteConfirmationModal.bind(
      this
    );

    this.state = {
      showAudioModal: false,
      showDeleteConfirmationModal: false,
      deleteItemIndex: undefined,
    };
  }

  onChangeMorphemePosition = (e) => {
    let updatedMorphemesList = this.props.children; //the new list
    let swpIdx = parseInt(e.idx); //the idx of the one we clicked the button on
    let pos = e.position; //the position of the item at that location
    let dir = e.dir; //The direction we need to move it
    let targetIdx = -1; //The index of who we are swapping with. SHOULD NOT STAY -1, THIS IS FOR CATCHING ERRORS

    //Setup our Swap
    if(swpIdx === 0 && dir === 'up')
      targetIdx = updatedMorphemesList.length - 1;
     else if (swpIdx === updatedMorphemesList.length-1 && dir === 'down')
      targetIdx = 0;
     else if (dir === 'up')
      targetIdx = swpIdx - 1;
     else if (dir === 'down')
      targetIdx = swpIdx + 1;
     else
      console.error(`SWPi:${swpIdx} TARi: ${targetIdx} wtf`);

    //Grab the elements from the original list
    let swp = this.props.children[swpIdx];
    let target = this.props.children[targetIdx];

    //Switch the position _fields_ on the items
    target.position = swpIdx;
    swp.position = targetIdx;

    //swap the positions of the items themselves in the array
    updatedMorphemesList[swpIdx] = target;
    updatedMorphemesList[targetIdx] = swp;

    //Update the parent with the new list.
    this.updateParentState(updatedMorphemesList);
  };

  onChangeMorphemeCree = (e) => {
    let updatedMorphemesList = this.props.children;
    let curIdx = e.target.id.split("_")[1];

    updatedMorphemesList[curIdx].morph_cree = e.target.value;
    this.updateParentState(updatedMorphemesList);
  };

  onChangeMorphemeEnglish = (e) => {
    let updatedMorphemesList = this.props.children;
    let curIdx = e.target.id.split("_")[1];

    updatedMorphemesList[curIdx].morph_english = e.target.value;
    this.updateParentState(updatedMorphemesList);
  };

  updateParentState = (morphemeList) => {
    this.props.updateStateFunction(morphemeList);
  };

  onConfirmDelete = (elementId) => {
    this.setState({
      showDeleteConfirmationModal: false,
    });

    let updatedMorphemesList = this.props.children;
    updatedMorphemesList.splice(elementId, 1);

    this.updateParentState(updatedMorphemesList);
  };

  onClickDeleteMorpheme = (e) => {
    this.setState({
      showDeleteConfirmationModal: true,
      deleteItemIndex: e.target.id,
    });
  };

  closeDeleteConfirmationModal = () => {
    this.setState({
      showDeleteConfirmationModal: false,
      deleteItemIndex: undefined,
    });
  };

  render() {
    return (
      <div>
        <h5 className="font-weight-bold">Morphemes</h5>

        <table className="table table-striped table-bordered mt-4 mb-4">
          <thead className="thead-dark">
            <tr>
              <th scope="col" width="30">
                Position
              </th>
              <th scope="col">Language: Indigenous</th>
              <th scope="col">Language: English</th>
              <th scope="col" width="100">
                Options
              </th>
            </tr>
          </thead>

          <tbody>
            {this.props.children.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <ButtonGroup>
                      <Button className="btn-dark mb-2"
                      size={"sm"}
                      onClick={() => this.onChangeMorphemePosition({idx:idx,position:val.position,dir:'up'})}>
                      <ArrowUp className="btn-dark"/>
                    </Button>

                    <Button className="btn-dark mb-2"
                      size={"sm"}
                      onClick={() => this.onChangeMorphemePosition({idx:idx,position:val.position,dir:'down'})}>
                      <ArrowDown/>
                    </Button>
                    </ButtonGroup>

                  </td>
                  <td>
                    <input
                      type="text"
                      required
                      className="form-control"
                      id={"ind_"+idx}
                      placeholder={val.morph_cree}
                      value={val.morph_cree}
                      onChange={this.onChangeMorphemeCree}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      required
                      className="form-control"
                      id={"eng_" + idx}
                      placeholder={val.morph_english}
                      value={val.morph_english}
                      onChange={this.onChangeMorphemeEnglish}
                    />
                  </td>
                  <td>
                    <TabbleButton id={idx} onClick={this.onClickDeleteMorpheme}>
                      Delete
                    </TabbleButton>
                    <ConfirmDelete
                      id={this.state.deleteItemIndex}
                      show={this.state.showDeleteConfirmationModal}
                      closeModalCallback={this.closeDeleteConfirmationModal}
                      deleteFunction={this.onConfirmDelete}
                    ></ConfirmDelete>
                  </td>
                </tr>
              );
            }).sort((a,b) => (a.position - b.position))}
          </tbody>
        </table>
      </div>
    );
  }
}
