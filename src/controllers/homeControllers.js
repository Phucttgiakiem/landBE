let getHomePage = (req, res) => {
    return res.send("Hello World from Controllers");
}

module.exports = {
    getHomePage: getHomePage
};