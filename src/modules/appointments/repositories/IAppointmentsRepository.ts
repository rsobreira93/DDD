import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppoitmentDTO from '../dtos/ICreateAppointmentDTO';
export default interface IAppointmentsRepository{
    create(data: ICreateAppoitmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>
}
