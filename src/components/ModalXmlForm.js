import React, { useState } from "react";
import XMLParser from "react-xml-parser";
import { DateTime } from "luxon";
import { debounce } from "./debounce";
import { v4 as uuidv4 } from "uuid";

function ModalXmlForm({ setIsModalXmlForm }) {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilesPicked, setIsFilesPicked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [filesCount, setFilesCount] = useState({});
  const [inputVal, setInputVal] = useState("");

  const changeHandler = (event) => {
    if (event.target.files.length > 20) {
      alert("Maksymalna liczba plików to 20");
      setIsFilesPicked(false);
      return;
    }
    setSelectedFile(event.target.files);
    setIsFilesPicked(true);
  };

  const handleSubmission = () => {
    setLoader(true);
    let progArr = [];

    for (let i = 0; i < selectedFile.length; i++) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var doc = new XMLParser().parseFromString(e.target.result);

        doc.getElementsByTagName("Event").forEach((prog) => {
          progArr.push({
            title: prog.children[1].value.toUpperCase(),
            time: prog.children[2].value,
          });
        });
      };
      reader.onloadend = function () {
        const multiCounts = progArr.reduce(
          (acc, value) => ({
            ...acc,
            [value.title]: {
              counter: (acc[value.title]?.counter || 0) + 1,
              time: [...(acc[value.title]?.time || ""), value.time],
            },
          }),
          {}
        );
        setFilesCount(multiCounts);
        setLoader(false);
      };
      reader.readAsText(selectedFile.item(i));
    }
  };

  const handleClose = () => {
    setIsModalXmlForm(false);
  };

  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span onClick={handleClose} className="close">
          &times;
        </span>
        <div className="xmlUploadForm_gosia">
          <input
            className="custom-file-upload"
            type="file"
            name="file"
            multiple
            onChange={changeHandler}
          />
          <button
            disabled={!isFilesPicked || loader}
            className={`xmlUploadBtn ${
              !isFilesPicked || loader ? "disabled" : ""
            }`}
            onClick={handleSubmission}
          >
            Submit
          </button>
        </div>
        <input
          onChange={debounce(handleChange, 500)}
          className="gosia_input"
          placeholder="Szukaj"
        />
        {loader ? (
          <div className="loader-div">
            <div className="loader"></div>
          </div>
        ) : (
          <div>
            {Object.keys(filesCount).length !== 0 && inputVal.length > 1 && (
              <table>
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Counter</th>
                    <th>Times</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filesCount)
                    .sort()
                    .filter((prog) => prog[0].includes(inputVal.toUpperCase()))
                    .map((prog) => (
                      <tr key={uuidv4()}>
                        <td>{prog[0]}</td>
                        <td>{prog[1].counter}</td>
                        <td>
                          {prog[1].time.sort().map((t) => (
                            <p key={uuidv4()}>
                              ({DateTime.fromJSDate(new Date(t)).toFormat("f")})
                            </p>
                          ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            {Object.keys(filesCount).length !== 0 && inputVal.length <= 1 && (
              <table>
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Counter</th>
                    <th>Times</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(filesCount)
                    .sort()
                    .map((prog) => (
                      <tr key={uuidv4()}>
                        <td>{prog[0]}</td>
                        <td>{prog[1].counter}</td>
                        <td>
                          {prog[1].time.sort().map((t) => (
                            <p key={uuidv4()}>
                              ({DateTime.fromJSDate(new Date(t)).toFormat("f")})
                            </p>
                          ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalXmlForm;
