import { data } from "./api.js";

data.forEach((roadInfo) => {
  let temp = [];
  let curIndicators = roadInfo.expresswaygislist[0].indicators;

  // 路线
  roadInfo.expresswaygislist.forEach(
    ({ indicators, indicatorsGisDataList }, index) => {
      const pathList = indicatorsGisDataList.map((item) => [
        item.lng,
        item.lat,
      ]);

      // console.log("i", indicators);

      // index + 1 === roadInfo.expresswaygislist.length &&
      //   console.log("最后一个");

      if (curIndicators === indicators) {
        temp = temp.concat(pathList);
      } else {
        // index + 1 === roadInfo.expresswaygislist.length &&
        // console.log("最后一个");

        console.log("", indicators, curIndicators, temp.length);

        curIndicators = indicators;
        temp = pathList;
      }
    }
  );
});
