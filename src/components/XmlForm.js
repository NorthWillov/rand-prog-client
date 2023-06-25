import React, { useState } from "react";
import XMLParser from "react-xml-parser";
import { DateTime } from "luxon";

function XmlForm({ palette, setPalette }) {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [filesCount, setFilesCount] = useState({});
  const [foundedExpiredProgs, setFoundedExpiredProgs] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  // const handleCheckboxChange = () => {
  //   setIsTestFilesTimesChecked(!isTestFilesTimesChecked);
  // };

  const handleSubmission = () => {
    var readXml = null;
    var reader = new FileReader();
    reader.onload = function (e) {
      readXml = e.target.result;
      var doc = new XMLParser().parseFromString(readXml);
      const newWarnings = [];
      const passedOldProgs = [];

      const startTimesArr = doc.getElementsByTagName("StartTime");

      const counts = doc
        .getElementsByTagName("Event")
        .map((prog, idx) => {
          // Check if "Event Exit" is not equals to 0 and display a warning about it
          if (Number(prog.children[18].value) !== 0) {
            newWarnings.push({
              title: prog.children[1].value,
              time: DateTime.fromJSDate(
                new Date(prog.children[2].value)
              ).toLocaleString(DateTime.TIME_24_SIMPLE),
            });
          }
          // Check if program is expired and it should not be on the playlist
          if (
            palette.unusedProgs?.includes(
              prog.children[1].value.toUpperCase()
            ) &&
            !passedOldProgs.includes(prog.children[1].value.toUpperCase())
          ) {
            passedOldProgs.push(prog.children[1].value.toUpperCase());
          }

          // Calculating miliseconds from files
          const ms =
            new Date(startTimesArr[idx + 1]?.value).getTime() -
              new Date(prog.children[2].value).getTime() || 4000;

          return {
            title: prog.children[1].value.toUpperCase(),
            time: prog.children[2].value,
            category: prog.children[28].value,
            duration: ms,
          };
        })
        .reduce(
          (acc, value) => ({
            ...acc,
            [value.title]: {
              counter: (acc[value.title]?.counter || 0) + 1,
              time: [...(acc[value.title]?.time || ""), value.time],
              category: value.category,
              duration: value.duration,
            },
          }),
          {}
        );
      setWarnings(newWarnings);
      setFoundedExpiredProgs(passedOldProgs);
      setFilesCount(counts);

      // isTestFilesTimesChecked
      //   ? setShowTestFilesTimesChecked(true)
      //   : setShowTestFilesTimesChecked(false);

      // recalculate counters after playlist submit

      const progsWithRecalculatedCounters = [];

      palette.tvPrograms.forEach((prog) => {
        if (counts[prog.filename.toUpperCase()]) {
          progsWithRecalculatedCounters.push({
            ...prog,
            counter: counts[prog.filename.toUpperCase()].counter,
          });
        }
      });

      const mergedArray = palette.tvPrograms.map((obj1) => {
        const matchingObj = progsWithRecalculatedCounters.find(
          (obj2) => obj2.filename === obj1.filename
        );
        if (matchingObj) {
          return { ...obj1, counter: matchingObj.counter };
        } else {
          return obj1;
        }
      });

      setPalette({
        ...palette,
        tvPrograms: mergedArray,
      });

      // let newDb = {};
      // for (const category in progs) {
      //   console.log(progs);
      //   newDb = {
      //     ...newDb,
      //     [category]: progs[category].map((prog) => ({
      //       ...prog,
      //       counter: counts[prog.program.toUpperCase()]?.counter || 0,
      //     })),
      //   };
      // }
      // setProgs(newDb);
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="xmlPage">
      {warnings.length !== 0 && (
        <div>
          <ul>
            {warnings.map((warning) => (
              <li key={warning.time} className="warning">
                WARNING: NA PROGRAM <b>"{warning.title}"</b> O GODZINIE{" "}
                <b>"{warning.time}"</b> JEST USTAWIONY EXIT MANUAL
              </li>
            ))}
          </ul>
        </div>
      )}
      {foundedExpiredProgs.length !== 0 && (
        <div>
          <ul>
            {foundedExpiredProgs.map((prog, idx) => (
              <li key={idx} className="warning">
                WARNING: PLIK <b>"{prog}"</b> ZOSTAŁ WPISANY W PLAYLISTĘ, JEST
                ZASTARZAŁY I MUSI BYĆ ZAMIENIONY NA NOWY!
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="xmlUploadForm">
        <input
          className="custom-file-upload"
          type="file"
          name="file"
          onChange={changeHandler}
        />
        <button className="xmlUploadBtn" onClick={handleSubmission}>
          Submit
        </button>
      </div>
      {/* <label style={{ margin: "0 auto 50px" }}>
        <input
          type="checkbox"
          checked={isTestFilesTimesChecked}
          onChange={handleCheckboxChange}
        />
        Submit with checks of files that are in the correct times
      </label> */}
      {Object.keys(filesCount).length !== 0 && (
        <>
          {/* {showTestFilesTimesChecked && (
            <TestFilesCorrectTimes filesCount={filesCount} />
          )} */}
          {/* <PieRechart files={filesCount} /> */}
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
                  <tr key={prog[0]}>
                    <td>{prog[0]}</td>
                    <td>{prog[1].counter}</td>
                    <td>
                      {prog[1].time
                        .map((t) =>
                          DateTime.fromJSDate(new Date(t)).toLocaleString(
                            DateTime.TIME_24_SIMPLE
                          )
                        )
                        .join(", ")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default XmlForm;
