import { Company } from '../models/Company.js'

export default {
	async getCompany(req, res) {
		try {
			const company = await Company.findByPk(req.params.companyId);

			res.send(company)
		} catch (err) {
			res.status(500).send({
				error: 'An error occured when trying to fetch company.'
			})
		}
	}
}