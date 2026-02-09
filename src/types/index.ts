// MLM Commission System - TypeScript Types
// All monetary values in CENTS (integer)

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Consultant ranks in the MLM hierarchy
 */
export enum ConsultantRank {
  BUSINESS_CONSULTANT = 'BUSINESS_CONSULTANT',
  SENIOR_CONSULTANT = 'SENIOR_CONSULTANT',
  YOUNG = 'YOUNG',
  PROFESSIONAL_CONSULTANT = 'PROFESSIONAL_CONSULTANT',
  LEAD_CONSULTANT = 'LEAD_CONSULTANT',
  PROFESSIONAL_MASTER_CONSULTANT = 'PROFESSIONAL_MASTER_CONSULTANT',
  EXECUTIVE_CONSULTANT = 'EXECUTIVE_CONSULTANT',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

/**
 * Product types available in the catalog
 */
export enum ProductType {
  MOBILE_CHILD = 'MOBILE_CHILD',
  MOBILE_SMALL = 'MOBILE_SMALL',
  MOBILE_MEDIUM = 'MOBILE_MEDIUM',
  MOBILE_LARGE = 'MOBILE_LARGE',
  MOBILE_UNLIMITED = 'MOBILE_UNLIMITED',
  INTERNET = 'INTERNET',
  ORANGE_TV = 'ORANGE_TV',
  ENERGIE_RESIDENTIEEL = 'ENERGIE_RESIDENTIEEL',
  SOHO_ENERGIE = 'SOHO_ENERGIE',
  KETELONDERHOUD = 'KETELONDERHOUD',
}

/**
 * Service status for tracking sales
 */
export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Commission payment status
 */
export enum CommissionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CLAWED_BACK = 'CLAWED_BACK',
  ADJUSTED = 'ADJUSTED',
}

/**
 * Fidelity payment status
 */
export enum FidelityStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  STOPPED = 'STOPPED',
}

/**
 * Reasons for clawback
 */
export enum ClawbackReason {
  CANCELLATION_WITHIN_1_MONTH = 'CANCELLATION_WITHIN_1_MONTH',
  CANCELLATION_1_TO_6_MONTHS = 'CANCELLATION_1_TO_6_MONTHS',
  CANCELLATION_AFTER_6_MONTHS = 'CANCELLATION_AFTER_6_MONTHS',
  ADMINISTRATIVE_ERROR = 'ADMINISTRATIVE_ERROR',
  FRAUD = 'FRAUD',
}

/**
 * Types of incentives
 */
export enum IncentiveType {
  QUARTERLY_BONUS = 'QUARTERLY_BONUS',
  YEARLY_BONUS = 'YEARLY_BONUS',
  RANK_BONUS = 'RANK_BONUS',
  TEAM_BONUS = 'TEAM_BONUS',
  SPECIAL_PROMOTION = 'SPECIAL_PROMOTION',
}

/**
 * Incentive status
 */
export enum IncentiveStatus {
  PENDING = 'PENDING',
  EARNED = 'EARNED',
  PAID = 'PAID',
  FORFEITED = 'FORFEITED',
}

// ============================================================================
// BASE INTERFACES
// ============================================================================

/**
 * Consultant - MLM network member
 */
export interface Consultant {
  id: string;
  consultantCode: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  
  // Rank and career
  currentRank: ConsultantRank;
  rankAchievedAt?: Date;
  
  // Sponsor relation
  sponsorId?: string;
  sponsor?: Consultant;
  downlines?: Consultant[];
  
  // Banking
  iban?: string;
  bic?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  activatedAt?: Date;
}

/**
 * Product - Catalog item with commission structure
 */
export interface Product {
  id: string;
  productCode: string;
  name: string;
  nameNl?: string;
  productType: ProductType;
  
  // Commission amounts (in CENTS)
  bcAmount: number;
  scPlusAmount: number;
  
  // Additional bonuses (in CENTS)
  convergenceBonus?: number;
  portabilityBonus?: number;
  sohoBonus?: number;
  
  // ASP Points
  aspPoints: number;
  
  // Fidelity amounts (in CENTS per month)
  fidelityN0?: number;
  fidelityN1?: number;
  fidelityN2To6?: number;
  fidelityN7?: number;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service - A sold/activated service
 */
export interface Service {
  id: string;
  serviceNumber: string;
  
  // Relations
  consultantId: string;
  consultant: Consultant;
  productId: string;
  product: Product;
  
  // Status
  status: ServiceStatus;
  
  // Dates
  saleDate: Date;
  activationDate?: Date;
  cancellationDate?: Date;
  
  // Flags
  hasEasySwitch: boolean;
  hasConvergence: boolean;
  hasPortability: boolean;
  isSoHo: boolean;
  
  // Calculated at sale time
  totalBcAmount: number;
  totalScAmount: number;
  totalAspPoints: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Commission - Retail commission payment
 */
export interface Commission {
  id: string;
  
  // Relations
  consultantId: string;
  consultant: Consultant;
  serviceId: string;
  service: Service;
  
  // Commission details
  commissionType: 'RETAIL' | 'BONUS' | 'OVERRIDE';
  amount: number; // In CENTS
  
  // Breakdown
  baseAmount: number;
  bonusAmount: number;
  
  // Status
  status: CommissionStatus;
  
  // Payment info
  calculatedAt: Date;
  paidAt?: Date;
  paymentPeriod?: string; // YYYY-MM format
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * FidelityLog - Monthly fidelity payment record
 */
export interface FidelityLog {
  id: string;
  
  // Relations
  consultantId: string;
  consultant: Consultant;
  serviceId: string;
  service: Service;
  
  // Fidelity details
  networkLevel: number;
  amount: number; // In CENTS
  
  // Period
  year: number;
  month: number;
  period: string; // YYYY-MM format
  
  // Status
  status: FidelityStatus;
  
  // Payment info
  calculatedAt: Date;
  paidAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PQS - Personal Quality Structure record
 */
export interface PQS {
  id: string;
  
  // Relations
  consultantId: string;
  consultant: Consultant;
  
  // Period
  year: number;
  quarter: number;
  period: string; // YYYY-Q# format
  
  // Points breakdown
  pqsPoints: number;   // 50 points
  qs1Points: number;   // 20 points
  qs2Points: number;   // 10 points
  qs3Points: number;   // 5 points
  qs4Points: number;   // 5 points
  qs5Points: number;   // 5 points
  qs6Points: number;   // 5 points
  qs7Points: number;   // 10 points
  
  // Totals
  totalPoints: number;
  
  // ASP tracking
  personalAsp: number;
  teamAsp: number;
  
  // Qualification
  isQualified: boolean;
  qualifiedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Incentive - Quarterly/yearly bonus
 */
export interface Incentive {
  id: string;
  
  // Relations
  consultantId: string;
  consultant: Consultant;
  
  // Incentive details
  incentiveType: IncentiveType;
  name: string;
  description?: string;
  
  // Period
  year: number;
  quarter?: number;
  period: string;
  
  // Requirements
  requiredPoints?: number;
  requiredRank?: ConsultantRank;
  
  // Reward
  rewardAmount?: number; // In CENTS
  rewardDescription?: string;
  
  // Status
  status: IncentiveStatus;
  
  // Dates
  earnedAt?: Date;
  paidAt?: Date;
  expiresAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Clawback - Commission recovery record
 */
export interface Clawback {
  id: string;
  
  // Relations
  consultantId: string;
  consultant: Consultant;
  serviceId: string;
  service: Service;
  
  // Clawback details
  reason: ClawbackReason;
  percentage: number; // 0, 25, 75, 100
  
  // Amounts (in CENTS)
  originalAmount: number;
  clawbackAmount: number;
  
  // Related commission
  commissionId?: string;
  
  // Status
  isProcessed: boolean;
  processedAt?: Date;
  
  // Cancellation details
  cancellationDate: Date;
  monthsActive: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CALCULATOR INPUT/OUTPUT TYPES
// ============================================================================

/**
 * Input for commission calculation
 */
export interface CommissionCalculatorInput {
  consultantId: string;
  productId: string;
  productType: ProductType;
  consultantRank: ConsultantRank;
  
  // Flags
  hasEasySwitch?: boolean;
  hasConvergence?: boolean;
  hasPortability?: boolean;
  isSoHo?: boolean;
  
  // Sale date
  saleDate: Date;
}

/**
 * Output from commission calculation
 */
export interface CommissionCalculatorOutput {
  baseAmount: number;      // In CENTS
  bonusAmount: number;     // In CENTS
  totalAmount: number;     // In CENTS
  aspPoints: number;
  
  // Breakdown
  breakdown: {
    baseCommission: number;
    convergenceBonus?: number;
    portabilityBonus?: number;
    sohoBonus?: number;
    easySwitchBonus?: number;
  };
}

/**
 * Input for fidelity calculation
 */
export interface FidelityCalculatorInput {
  consultantId: string;
  serviceId: string;
  productId: string;
  networkLevel: number;
  year: number;
  month: number;
}

/**
 * Output from fidelity calculation
 */
export interface FidelityCalculatorOutput {
  amount: number; // In CENTS
  period: string; // YYYY-MM
}

/**
 * Input for PQS calculation
 */
export interface PQSCalculatorInput {
  consultantId: string;
  year: number;
  quarter: number;
  personalAsp: number;
  teamAsp: number;
  
  // QS qualifications
  hasPQS: boolean;
  hasQS1: boolean;
  hasQS2: boolean;
  hasQS3: boolean;
  hasQS4: boolean;
  hasQS5: boolean;
  hasQS6: boolean;
  hasQS7: boolean;
}

/**
 * Output from PQS calculation
 */
export interface PQSCalculatorOutput {
  totalPoints: number;
  isQualified: boolean;
  pointsBreakdown: {
    pqs: number;
    qs1: number;
    qs2: number;
    qs3: number;
    qs4: number;
    qs5: number;
    qs6: number;
    qs7: number;
  };
}

/**
 * Input for clawback calculation
 */
export interface ClawbackCalculatorInput {
  serviceId: string;
  originalAmount: number; // In CENTS
  activationDate: Date;
  cancellationDate: Date;
}

/**
 * Output from clawback calculation
 */
export interface ClawbackCalculatorOutput {
  percentage: number;
  clawbackAmount: number; // In CENTS
  reason: ClawbackReason;
  monthsActive: number;
}

// ============================================================================
// DTO TYPES (for API requests/responses)
// ============================================================================

/**
 * Create Consultant DTO
 */
export interface CreateConsultantDto {
  consultantCode: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  sponsorId?: string;
  iban?: string;
  bic?: string;
}

/**
 * Create Service DTO
 */
export interface CreateServiceDto {
  serviceNumber: string;
  consultantId: string;
  productId: string;
  saleDate: Date;
  hasEasySwitch?: boolean;
  hasConvergence?: boolean;
  hasPortability?: boolean;
  isSoHo?: boolean;
}

/**
 * Commission Report DTO
 */
export interface CommissionReportDto {
  consultantId: string;
  period: string; // YYYY-MM
  totalCommissions: number;
  totalAmount: number; // In CENTS
  commissions: Commission[];
}

/**
 * Fidelity Report DTO
 */
export interface FidelityReportDto {
  consultantId: string;
  period: string; // YYYY-MM
  totalFidelity: number; // In CENTS
  serviceCount: number;
  logs: FidelityLog[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Money amount in cents (type alias for clarity)
 */
export type Cents = number;

/**
 * Period string format YYYY-MM
 */
export type MonthPeriod = string;

/**
 * Quarter period string format YYYY-Q#
 */
export type QuarterPeriod = string;

/**
 * Network level for fidelity (0, 1, 2-6, 7+)
 */
export type NetworkLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Clawback percentage rules
 */
export interface ClawbackRules {
  lessThan1Month: 0;
  oneToSixMonths: 25;
  afterSixMonths: 75;
}

/**
 * PQS Points structure
 */
export interface PQSStructure {
  PQS: 50;
  QS1: 20;
  QS2: 10;
  QS3: 5;
  QS4: 5;
  QS5: 5;
  QS6: 5;
  QS7: 10;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * PQS Points constants
 */
export const PQS_POINTS: PQSStructure = {
  PQS: 50,
  QS1: 20,
  QS2: 10,
  QS3: 5,
  QS4: 5,
  QS5: 5,
  QS6: 5,
  QS7: 10,
};

/**
 * Clawback percentage constants
 */
export const CLAWBACK_PERCENTAGES: ClawbackRules = {
  lessThan1Month: 0,
  oneToSixMonths: 25,
  afterSixMonths: 75,
};

/**
 * Rank display names (Dutch/English)
 */
export const RANK_DISPLAY_NAMES: Record<ConsultantRank, string> = {
  [ConsultantRank.BUSINESS_CONSULTANT]: 'Business Consultant (BC)',
  [ConsultantRank.SENIOR_CONSULTANT]: 'Senior Consultant (SC)',
  [ConsultantRank.YOUNG]: 'Young (Y)',
  [ConsultantRank.PROFESSIONAL_CONSULTANT]: 'Professional Consultant (PC)',
  [ConsultantRank.LEAD_CONSULTANT]: 'Lead Consultant (Le)',
  [ConsultantRank.PROFESSIONAL_MASTER_CONSULTANT]: 'Professional Master Consultant (PMC)',
  [ConsultantRank.EXECUTIVE_CONSULTANT]: 'Executive Consultant (EC)',
  [ConsultantRank.SILVER]: 'Silver',
  [ConsultantRank.GOLD]: 'Gold',
  [ConsultantRank.PLATINUM]: 'Platinum',
  [ConsultantRank.DIAMOND]: 'Diamond',
};

/**
 * Product display names
 */
export const PRODUCT_DISPLAY_NAMES: Record<ProductType, string> = {
  [ProductType.MOBILE_CHILD]: 'Mobile Kind',
  [ProductType.MOBILE_SMALL]: 'Mobile Small',
  [ProductType.MOBILE_MEDIUM]: 'Mobile Medium',
  [ProductType.MOBILE_LARGE]: 'Mobile Large',
  [ProductType.MOBILE_UNLIMITED]: 'Mobile Unlimited',
  [ProductType.INTERNET]: 'Internet',
  [ProductType.ORANGE_TV]: 'Orange TV',
  [ProductType.ENERGIE_RESIDENTIEEL]: 'Energie Residentieel',
  [ProductType.SOHO_ENERGIE]: 'SoHo Energie',
  [ProductType.KETELONDERHOUD]: 'Ketelonderhoud',
};
