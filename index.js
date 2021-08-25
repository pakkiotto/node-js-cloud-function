const resolver = require('./resolver')

exports.refreshDatabase = async (req, res) => {
    try {
    await resolver.initOrUpdateCloudDb();
    res.status(200).send({"message":"done"});
    } catch (error) {
      //return an error
      console.log("got error: ", error);
      res.status(500).send(error);
    }
};

exports.getAll = async (req, res) => {
  const nationality = req.body.nationality || null;
  const ruolo = req.body.role || 'all';
  try {
  const players = await resolver.getAll(ruolo, nationality);
  res.status(200).send({players});
  } catch (error) {
    //return an error
    console.log("got error: ", error);
    res.status(500).send(error);
  }
};