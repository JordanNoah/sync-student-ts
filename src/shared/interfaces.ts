import { Environment } from './types';

export interface MapperInterfaceError {
  errorAbbreviation: string;
  errorMessage: string;
}
export interface AddresseeMailnterface {
  id: number;
  reason: string;
  email: string;
  params: string | null;
  activate: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface EventReceivingQueueLogInterface {
  id: number;
  event_receiving_queue_id: number;
  status_transaction_catalog_id: number;
  attempts: number;
  params: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface EventReceivingQueueInterface {
  id: number;
  uuid: string;
  received_data: string;
  processed_at: Date | null;
  attempts: number;
  event_name: string;
  status_transaction_catalog_id: number;
  scheduled_at: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  is_processed_batch: boolean;
}

export interface InscriptionEventInterface {
  id: number;
  uuid_external_inscription: string;
  data: string;
  is_forced: boolean;
  processed_at: Date | null;
  status_transaction_catalog_id: number;
  event_receiving_queue_id: number;
  scheduled_at: Date | null;
  id_number_student: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationInterface {
  id: number;
  uuid: string;
  name: string;
  abbreviation: string;
  degree_abbreviation: string;
  origin: string | null;
  rest_path: string | null;
  token: string | null;
  modality: string | null;
  additional_data: string | null;
  translations: string | null;
  parent: number | null;
  importance: number | null;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AcademicProgramDtoInterface {
    name: string;
    type: string;
    uuid: string;
    version: string;
    language: string;
    abbreviation: string;
    reference_id: number;
}

export interface GetGroupByNumberIdInterface {
  id:          number;
  externalId:  number;
  idNumber:    string;
  name:        string;
  description: string;
  courseId:    number;
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   Date | null;
}


export interface MoodleErrorInterface {
  exception: string,
  errorcode: string,
  message: string,
  debuginfo: string
}

export interface UserInterface {
  id?: number   //ID of the user
  username: string  //Username policy is defined in Moodle security config.
  suspended?: number  //Suspend user account, either false to enable user login or true to disable it
  firstname: string  //The first name(s) of the user
  lastname: string  //The family name of the user
  email: string  //A valid and unique email address
  city: string | null  //Home city of the user
  country: string | null //Home country code of the user, such as AU or CZ
  idnumber: string  //An arbitrary ID code number perhaps from the institution
  phone1: string  //Phone
  address: string | null //Postal address
  password?: string  //Plain text password consisting of any characters
}

export interface EnrolUsersInterface {
  roleid: number;
  userid: number;
  courseid: number;
  timestart: number;
  timeend: number;
  suspend: number;
}
export interface EnenrolUsersInterface {
  userid: number;
  courseid: number;
  roleid: number;
}

export interface GroupsInterface {
  courseid: number;
  name: string;
  description: string;
  descriptionformat: number;
  enrolmentkey?: string;
  idnumber: string;
}

export interface GroupingsInterface {
  courseid: number;
  name: string;
  description: string;
  descriptionformat: number;
  idnumber: string;
}

export interface AddGroupInterface {
  groupid: number;
  userid: number;
}

export interface RoleAssignmentInterface {
  roleid: number;
  userid: number;
  contextid: number;
  contextlevel: string;
  instanceid: number;
}

export interface UserSuspendInterface {
  id: number;        // ID del usuario en Moodle
  suspended: number; // 1 para suspender, 0 para reactivar
}

export interface MailerTemplateInterface {
  id: number;
  name: string;
  abbreviation: string;
  doctype: string;
  head: string;
  header: string;
  body: string | null;
  footer: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MailerContentInterface {
  id: number;
  name: string;
  abbreviation: string;
  bodyHeader: string;
  bodyDescription: string;
  body: string;
  bodyLastDescription: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MailerNotificationInterface {
  id: number;
  name: string;
  abbreviation: string;
  subject: string;
  to: { [key in Environment]: string[] };
  cc: { [key in Environment]: string[] };
  cco: { [key in Environment]: string[] };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MailerTemplateContentInterface {
  id: number;
  templateId: number;
  contentId: number;
  mailerNotificationId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CourseInterface {
  id: number,
  external_id: number,
  institution_id: number,
  name: string,
  short_name: string,
  id_number: string,
  start_date: number,
  end_date: number,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
}
export interface ExistingCourseInterface {
  existCourse: CourseInterface[],
  missingCourse: string[]
}

export interface EnrollmentMoodleInterface {
  roleid: number,
  userid: number,
  courseid: number,
  timestart?: number,
  timeend?: number,
  suspend?: number
}

export interface MapperAcademicElement {uuid:string,startedAt:number,finishedAt?:number}

export interface VersionMigrationInterface {
  id: number;
  version: string;
  programMigrationId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  programMigration?: ProgramMigrationInteface;
}

export interface ProgramMigrationInteface {
  id: number;
  uuid: string;
  abbreviation: string;
  params: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  versions: VersionMigrationInterface[];
}

export interface ProgramSpecialInterface {
  id: number;
  uuid: string;
  abbreviation: string;
  params: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  versions: VersionSpecialInterface[];
}

export interface VersionSpecialInterface {
  id: number;
  version: string;
  programSpecialId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  programMigration?: ProgramMigrationInteface;
}