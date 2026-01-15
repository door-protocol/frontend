/**
 * DOOR Protocol - Configuration Constants
 *
 * This file contains default/fallback values used throughout the application.
 * These values are used when contract data is unavailable or as estimates.
 */

/**
 * Default Senior APY (%)
 * Used as fallback when contract data is unavailable
 */
export const DEFAULT_SENIOR_APY = 5.5;

/**
 * Default Protocol Fee Rate (basis points)
 * 100 basis points = 1%
 */
export const DEFAULT_PROTOCOL_FEE_BPS = 100;

/**
 * Estimated Vault Yield Rate (basis points)
 * 800 basis points = 8% annual yield
 * This is an estimated value for vault strategy returns
 */
export const ESTIMATED_VAULT_YIELD_BPS = 800;

/**
 * Default Minimum Junior Ratio (%)
 * Used as fallback for safety calculations
 */
export const DEFAULT_MIN_JUNIOR_RATIO = 10.0;

/**
 * Default Target APY (%)
 * Used as fallback for safety calculations
 */
export const DEFAULT_TARGET_APY = 5.5;
