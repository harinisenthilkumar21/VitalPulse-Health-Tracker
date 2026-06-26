import express from 'express';
import * as healthController from '../controllers/healthController';

const router = express.Router();

router.post('/register', healthController.register);
router.post('/login', healthController.login);

router.post('/vitals', healthController.addVitals);
router.get('/vitals/:user_id', healthController.getVitals);

router.post('/lifestyle', healthController.addLifestyle);
router.get('/lifestyle/:user_id', healthController.getLifestyle);

router.get('/alerts/:user_id', healthController.getAlerts);

router.post('/profile/change-password', healthController.changePassword);
router.get('/profile/:id', healthController.getProfile);
router.put('/profile/:id/password', healthController.changePassword);
router.put('/profile/:id', healthController.updateProfile);
router.delete('/profile/:id', healthController.deleteProfile);
router.put('/vitals/:id', healthController.updateVitals);
router.put('/lifestyle/:id', healthController.updateLifestyle);

export default router;
