import { Skill } from './skill';
import { Experience } from './experience';
import { Education } from './educations';

export class Resume {
Id: number;
Name: string;
ContactNumber: number;
Address: string;
Email: string;
SocialProfile: string;
OtherDetails: string;
Skills: Skill[];
Experience: Experience[];
Education: Education[];
}
