export interface CaseLaw {
  caseTitle: string;
  year: number;
  courtName: string;
  relevancePercentage: number;
  summary: string;
}

export interface StatuteReference {
  actName: string;
  sections: string[];
  applicability: string;
  penalties?: string;
}

export interface ActionStep {
  stepNumber: number;
  action: string;
  timeframe: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LegalResponse {
  englishAnalysis: string;
  hindiAnalysis: string;
  marathiAnalysis: string;
  
  suggestedAction: string;
  
  // Detailed analysis sections
  caseLaws: CaseLaw[];
  applicableStatutes: StatuteReference[];
  actionSteps: ActionStep[];
  prosCons: {
    pros: string[];
    cons: string[];
  };
  
  draftNoticeEN: string;
  draftNoticeHI: string;
  draftNoticeMR: string;
  
  // Metadata
  analysisConfidence: number;
  disclaimers: string[];
  nextSteps: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  response: LegalResponse;
  timestamp: number;
  hasDocument: boolean;
}

export type AppLanguage = 'EN' | 'HI' | 'MR';
