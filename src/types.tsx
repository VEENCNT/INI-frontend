export interface BiochemicalIndicator {
  indicatorId: number;
  title: string;
  description: string;
  lowerReferenceLimit: number;
  upperReferenceLimit: number;
  imageUrl?: string; 
  videoUrl?: string; 
  likes: number[];
}