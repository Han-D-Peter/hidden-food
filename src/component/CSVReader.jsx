import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { CustomMarker, InnerText, MapContainer } from "react-openlayers7";

function CSVReader() {
  const [csvData, setCSVData] = useState([]);
  const [catname, setCatname] = useState("모두 보기");

  useEffect(() => {
    fetch("/convertcsv.csv") // public 디렉토리의 파일 경로를 지정
      .then((response) => response.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true }); // CSV 파싱
        setCSVData(result.data);
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

  const categories = useMemo(() => {
    const cats = csvData.map((csv) => {
      if (csv.category_name) {
        return csv.category_name.split(">").pop();
      }
      return null;
    });

    const map = new Map();
    const uniqueArray = [];

    for (const item of cats) {
      if (!map.has(item)) {
        if (item !== null) {
          map.set(item, true);
          uniqueArray.push(item);
        }
      }
    }
    return uniqueArray;
  }, [csvData]);

  const filteredValue = useMemo(() => {
    if (catname === "모두 보기") {
      return csvData;
    }
    const filtered = csvData.filter((item) => {
      if (item.category_name) {
        return item.category_name.includes(catname);
      } else {
        return false;
      }
    });
    return filtered;
  }, [catname, csvData]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[126.9675222, 37.53609444]}
        zoomLevel={12}
        width="100vw"
        height="100vh"
      >
        {filteredValue.map((dat, index) => {
          const center = [Number(dat.x), Number(dat.y)];
          if (!dat.x || !dat.place_name) return null;
          return (
            <CustomMarker
              key={index}
              center={center}
              onClick={() => {
                window.location.href = dat.place_url;
              }}
            >
              <InnerText isPopup>{dat.place_name}</InnerText>
            </CustomMarker>
          );
        })}
      </MapContainer>
      <div style={{ position: "absolute", top: "0", left: "0" }}>
        <select value={catname} onChange={(e) => setCatname(e.target.value)}>
          <option value={"모두 보기"}>모두 보기</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CSVReader;
