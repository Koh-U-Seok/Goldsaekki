import axios from "axios";
import { useEffect, useState, useRef } from "react";
import MainCommunityComponent from "./MainCommunityComponent";

const getCommunityList = async (setCommunityNewestPost) => {
  try {
    const data = await axios.post("/api/board/mainCommunity");
    const result = data.data.result.sort(function (a, b) {
      return a.category < b.category ? -1 : a.category < b.category ? 1 : 0;
    });

    for (let i = 0; i < result.length; i++) {
      const year = result[i].createdAt.slice(0, 4);
      const month = result[i].createdAt.slice(5, 7);
      const date = result[i].createdAt.slice(8, 10);
      result[i].createdAt = `${year}.${month}.${date}`;
    }
    result[result.length - 1] = result.splice(
      result.findIndex((e) => e.category == "연재소설"),
      1
    )[0];
    setCommunityNewestPost(result);
  } catch (error) {
    setCommunityNewestPost([]);
  }
};

const MainCommunityContainer = () => {
  const [communityNewestPost, setCommunityNewestPost] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const onlyMainCommunity = useRef(false);

  const totalRanking = () => {
    axios.post("/api/rank/total").then((data) => {
      setTotalData(data.data.slice(0, 5));
    });
  };

  useEffect(() => {
    getCommunityList(setCommunityNewestPost);
  }, []);

  useEffect(() => {
    if (onlyMainCommunity.current) {
    } else onlyMainCommunity.current = true;
  }, [communityNewestPost]);
  return (
    <MainCommunityComponent
      communityNewestPost={communityNewestPost}
      totalData={totalData}
      totalRanking={totalRanking}
    ></MainCommunityComponent>
  );
};
export default MainCommunityContainer;
