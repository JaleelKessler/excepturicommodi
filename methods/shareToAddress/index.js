const axios = require("axios");
const {
  lighthouseBLSNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");
const { isEqual, isCidReg } = require("../../util/index");

module.exports.shareToAddress = async (
  address,
  cid,
  auth_token,
  shareTo
) => {
  try {
    if (!isCidReg(cid)) {
      throw new Error("Invalid CID");
    }
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/setSharedKey/${elem}`
        : `${lighthouseBLSNode}/api/setSharedKey/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .put(
            url,
            {
              address,
              cid: cid,
              shareTo,
            },
            {
              headers: {
                Authorization: "Bearer " + auth_token,
              },
            }
          )
          .then((res) => res.data);
      })
    );
    let temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp) && temp[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
