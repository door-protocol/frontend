/**
 * APY Calculation Utilities
 */

const BASIS_POINTS = 10000;

/**
 * Estimate Junior APY based on vault yield and waterfall distribution
 *
 * Formula:
 * 1. Total yield from vault strategy
 * 2. Senior payment = seniorPrincipal * seniorRate / BASIS_POINTS
 * 3. Protocol fee = totalYield * protocolFeeRate / BASIS_POINTS
 * 4. Junior yield = totalYield - seniorPayment - protocolFee
 * 5. Junior APY = (juniorYield / juniorPrincipal) * BASIS_POINTS
 *
 * @param seniorPrincipal - Total senior principal
 * @param juniorPrincipal - Total junior principal
 * @param seniorRate - Senior fixed rate in basis points
 * @param estimatedVaultYieldRate - Estimated annualized vault yield rate in basis points (e.g., 800 = 8%)
 * @param protocolFeeRate - Protocol fee rate in basis points (default 100 = 1%)
 * @returns Estimated junior APY in basis points, or null if cannot calculate
 */
export function estimateJuniorAPY(
  seniorPrincipal: bigint,
  juniorPrincipal: bigint,
  seniorRate: bigint,
  estimatedVaultYieldRate: number = 800, // Default 8% vault yield
  protocolFeeRate: number = 100, // Default 1% protocol fee
): number | null {
  // Cannot calculate if no junior principal
  if (juniorPrincipal === BigInt(0)) return null;

  const seniorPrincipalNum = Number(seniorPrincipal) / 1e6; // USDC has 6 decimals
  const juniorPrincipalNum = Number(juniorPrincipal) / 1e6;
  const totalPrincipal = seniorPrincipalNum + juniorPrincipalNum;

  // Estimate total annual yield from vault
  const totalAnnualYield =
    (totalPrincipal * estimatedVaultYieldRate) / BASIS_POINTS;

  // Calculate senior payment (annualized)
  const seniorRate_num = Number(seniorRate);
  const seniorPayment = (seniorPrincipalNum * seniorRate_num) / BASIS_POINTS;

  // Calculate protocol fee
  const protocolFee = (totalAnnualYield * protocolFeeRate) / BASIS_POINTS;

  // Calculate junior yield
  const juniorYield = totalAnnualYield - seniorPayment - protocolFee;

  // If junior yield is negative, return 0 (or show loss)
  if (juniorYield <= 0) return 0;

  // Calculate junior APY in basis points
  const juniorAPY = (juniorYield / juniorPrincipalNum) * BASIS_POINTS;

  return Math.round(juniorAPY);
}

/**
 * Calculate weighted average vault APY
 *
 * @param seniorPrincipal - Total senior principal
 * @param juniorPrincipal - Total junior principal
 * @param seniorAPY - Senior APY in basis points
 * @param juniorAPY - Junior APY in basis points
 * @returns Weighted average APY in basis points
 */
export function calculateVaultAPY(
  seniorPrincipal: bigint,
  juniorPrincipal: bigint,
  seniorAPY: number,
  juniorAPY: number,
): number {
  const seniorNum = Number(seniorPrincipal);
  const juniorNum = Number(juniorPrincipal);
  const totalPrincipal = seniorNum + juniorNum;

  if (totalPrincipal === 0) return 0;

  const weightedAPY =
    (seniorNum * seniorAPY + juniorNum * juniorAPY) / totalPrincipal;

  return Math.round(weightedAPY);
}

/**
 * Format APY from basis points to percentage string
 *
 * @param apyBasisPoints - APY in basis points (e.g., 550 = 5.5%)
 * @param decimals - Number of decimal places (default 1)
 * @returns Formatted percentage string
 */
export function formatAPY(
  apyBasisPoints: number,
  decimals: number = 1,
): string {
  return (apyBasisPoints / 100).toFixed(decimals);
}
