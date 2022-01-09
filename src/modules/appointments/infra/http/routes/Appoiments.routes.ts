import { Router } from "express";
import { parseISO } from "date-fns";
import { getCustomRepository } from "typeorm";

import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

const appointmentRouter = Router();


appointmentRouter.use(ensureAuthenticated);

appointmentRouter.get('/', async (request, response)=>{
    const appointmentsRepositoty = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepositoty.find();

    return response.json(appointments);
});

appointmentRouter.post('/', async (request, response)=>{
     const {provider_id, date } = request.body;
     const parsedDate = parseISO(date);
     const createAppointment = new CreateAppointmentService();
     const appointment = await createAppointment.execute({
         date: parsedDate,
         provider_id,
     });
     return response.json(appointment);

});

export default appointmentRouter;
