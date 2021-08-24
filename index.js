const resolver = require('./resolver')

exports.refreshDatabase = async (req, res) => {
    try {
      await resolver.initOrUpdateDb();
      res.status(200).send({"message":"done"});
    } catch (error) {
      //return an error
      console.log("got error: ", error);
      res.status(500).send(error);
    }
};