import { Router } from 'express';
import { FacultyControllers } from './faculty.controller';

const router = Router();

router.get('/', FacultyControllers.getAllFaculties);

export const FacultyRoutes = router;
