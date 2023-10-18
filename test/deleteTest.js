import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import user from '../models/User.js'

chai.use(chaiHttp);
const expect = chai.expect;
const args = process.argv
const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(
      payload,
      env.JWT_ACCESS_TOKEN,
      { expiresIn: env.JWT_ACCESS_TOKEN_LIFE }
  )
}
describe('CRUD API', () => {

  let authToken;
  const email = args[3]
  const id = args[4]

  before(async () => {
    const User = await user.findOne({ email: email})
    
    if(!User) { throw { code: 404, message: "EMAIL_NOT_FOUND"}}
    const payload = { id: User._id, role:User.role }

    authToken = await generateAccessToken(payload)
  });

  it('should successfully delete a post', (done) => {
    chai.request(app)
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal(`PRODUCT_DELETE_SUCCESS`);
        expect(res.body.data._id).to.equal(id); 
        done();
      });
  });
});