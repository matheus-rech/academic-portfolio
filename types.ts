
export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: 'Peer-Reviewed' | 'Accepted' | 'Book Chapter' | 'Abstract';
  doi?: string;
  url?: string;
  impactFactor?: string;
  quartile?: string;
  significance?: string; // Brief impact statement
  selected?: boolean;   // Whether it appears in "Selected Publications"
  certificate?: string; // Base64 image
}

export interface Experience {
  role: string;
  organization: string;
  location: string;
  period: string;
  points: string[];
  certificate?: string; // Base64 image
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details?: string[];
  certificate?: string; // Base64 image
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Honor {
  title: string;
  organization: string;
  year: number;
  certificate?: string; // Base64 image
}
