import { z } from "zod";

// ============================================================================
// FIELD TYPES — Every possible form field type
// ============================================================================

export const FieldTypeEnum = z.enum([
  "short_text",
  "long_text",
  "email",
  "phone",
  "number",
  "date",
  "time",
  "rating",
  "stars",
  "slider",
  "file_upload",
  "signature",
  "checkbox",
  "radio",
  "dropdown",
  "multiple_select",
  "image_choice",
  "video_choice",
  "matrix",
  "ranking",
  "likert",
  "nps",
  "address",
  "url",
  "social_links",
]);

export type FieldType = z.infer<typeof FieldTypeEnum>;

// ============================================================================
// FORM FIELD CONFIGURATION
// ============================================================================

/** Validation rules that can be applied to a field */
export const FieldValidationSchema = z.object({
  required: z.boolean().default(false),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  customMessage: z.string().optional(),
});

export type FieldValidation = z.infer<typeof FieldValidationSchema>;

/** Configuration specific to field type (e.g., dropdown options, slider range) */
export const FieldConfigSchema = z.object({
  placeholder: z.string().optional(),
  defaultValue: z.unknown().optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.string(),
        imageUrl: z.string().optional(),
      })
    )
    .optional(),
  // Slider config
  sliderMin: z.number().optional(),
  sliderMax: z.number().optional(),
  sliderStep: z.number().optional(),
  // Rating config
  maxRating: z.number().optional(),
  ratingIcon: z.enum(["star", "heart", "thumbs", "emoji"]).optional(),
  // File upload config
  allowedFileTypes: z.array(z.string()).optional(),
  maxFileSize: z.number().optional(),
  // Matrix config
  rows: z.array(z.string()).optional(),
  columns: z.array(z.string()).optional(),
  // NPS config
  npsLeftLabel: z.string().optional(),
  npsRightLabel: z.string().optional(),
});

export type FieldConfig = z.infer<typeof FieldConfigSchema>;

/** Conditional logic for showing/hiding fields */
export const ConditionalLogicSchema = z.object({
  action: z.enum(["show", "hide", "skip_to", "require"]),
  conditions: z.array(
    z.object({
      fieldId: z.string(),
      operator: z.enum([
        "equals",
        "not_equals",
        "contains",
        "not_contains",
        "greater_than",
        "less_than",
        "is_empty",
        "is_not_empty",
      ]),
      value: z.unknown(),
    })
  ),
  logicType: z.enum(["and", "or"]).default("and"),
  targetFieldId: z.string().optional(),
});

export type ConditionalLogic = z.infer<typeof ConditionalLogicSchema>;

// ============================================================================
// FORM FIELD
// ============================================================================

export const FormFieldSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  type: FieldTypeEnum,
  label: z.string(),
  description: z.string().optional(),
  order: z.number(),
  required: z.boolean().default(false),
  config: FieldConfigSchema.optional(),
  validation: FieldValidationSchema.optional(),
  conditionalLogic: ConditionalLogicSchema.optional(),
  section: z.string().optional(),
  width: z.enum(["full", "half", "third"]).default("full"),
});

export type FormField = z.infer<typeof FormFieldSchema>;

// ============================================================================
// LAYOUT TYPES
// ============================================================================

export const LayoutTypeEnum = z.enum([
  "single_page",
  "multi_page",
  "card_style",
  "conversational",
  "typeform_style",
  "notebook_style",
  "wizard",
  "chat_style",
]);

export type LayoutType = z.infer<typeof LayoutTypeEnum>;

// ============================================================================
// FORM STATUS
// ============================================================================

export const FormStatusEnum = z.enum([
  "draft",
  "published",
  "archived",
  "closed",
]);

export type FormStatus = z.infer<typeof FormStatusEnum>;

// ============================================================================
// THEME
// ============================================================================

export const ThemeColorsSchema = z.object({
  background: z.string().default("#F8F4EE"),
  surface: z.string().default("#FFFFFF"),
  primary: z.string().default("#8B5CF6"),
  secondary: z.string().default("#EC4899"),
  accent: z.string().default("#22C55E"),
  text: z.string().default("#1A1A2E"),
  textSecondary: z.string().default("#64748B"),
  border: z.string().default("#E2E8F0"),
  error: z.string().default("#EF4444"),
  success: z.string().default("#22C55E"),
});

export const ThemeTypographySchema = z.object({
  headingFont: z.string().default("Caveat"),
  bodyFont: z.string().default("Plus Jakarta Sans"),
  questionFont: z.string().default("Plus Jakarta Sans"),
  baseFontSize: z.number().default(16),
});

export const ThemeSpacingSchema = z.object({
  borderRadius: z.number().default(12),
  padding: z.number().default(24),
  gap: z.number().default(16),
  cardPadding: z.number().default(32),
});

export const ThemeAnimationsSchema = z.object({
  enableAnimations: z.boolean().default(true),
  transitionSpeed: z.enum(["slow", "normal", "fast"]).default("normal"),
  hoverEffect: z.enum(["lift", "glow", "scale", "none"]).default("lift"),
  scrollReveal: z.boolean().default(true),
});

export const TextureTypeEnum = z.enum([
  "paper",
  "notebook",
  "sketch",
  "grain",
  "retro_print",
  "glass",
  "modern",
  "minimal",
  "none",
]);

export type TextureType = z.infer<typeof TextureTypeEnum>;

export const ThemeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  creatorId: z.string().uuid().optional(),
  colors: ThemeColorsSchema,
  typography: ThemeTypographySchema,
  spacing: ThemeSpacingSchema,
  animations: ThemeAnimationsSchema,
  texture: TextureTypeEnum.default("none"),
  backgroundImage: z.string().optional(),
  isPublic: z.boolean().default(false),
  isMarketplace: z.boolean().default(false),
  price: z.number().default(0),
  downloads: z.number().default(0),
  rating: z.number().default(0),
  createdAt: z.date().optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;

// ============================================================================
// FORM
// ============================================================================

export const FormSettingsSchema = z.object({
  allowMultipleSubmissions: z.boolean().default(true),
  showProgressBar: z.boolean().default(true),
  shuffleQuestions: z.boolean().default(false),
  limitResponses: z.number().optional(),
  closingDate: z.date().optional(),
  successMessage: z.string().default("Thank you for your response!"),
  successRedirectUrl: z.string().optional(),
  requireLogin: z.boolean().default(false),
  enableNotifications: z.boolean().default(true),
});

export type FormSettings = z.infer<typeof FormSettingsSchema>;

export const FormSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  slug: z.string(),
  status: FormStatusEnum.default("draft"),
  themeId: z.string().uuid().optional(),
  settings: FormSettingsSchema.optional(),
  logicRules: z.array(ConditionalLogicSchema).optional(),
  layoutType: LayoutTypeEnum.default("single_page"),
  coverImage: z.string().optional(),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Form = z.infer<typeof FormSchema>;

// ============================================================================
// SUBMISSION
// ============================================================================

export const SubmissionSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
  status: z.enum(["in_progress", "completed", "abandoned"]).default("completed"),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      ip: z.string().optional(),
      country: z.string().optional(),
      device: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
  startedAt: z.date(),
  completedAt: z.date().optional(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

// ============================================================================
// USER
// ============================================================================

export const UserRoleEnum = z.enum(["user", "creator", "admin", "superadmin"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  firebaseUid: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  role: UserRoleEnum.default("user"),
  preferences: z
    .object({
      defaultTheme: z.string().optional(),
      defaultLayout: LayoutTypeEnum.optional(),
    })
    .optional(),
  xp: z.number().default(0),
  level: z.number().default(1),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================================
// ANALYTICS
// ============================================================================

export const FormAnalyticsSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  views: z.number().default(0),
  starts: z.number().default(0),
  completions: z.number().default(0),
  deviceStats: z
    .object({
      desktop: z.number().default(0),
      mobile: z.number().default(0),
      tablet: z.number().default(0),
    })
    .optional(),
  countryStats: z.record(z.string(), z.number()).optional(),
  fieldDropoff: z.record(z.string(), z.number()).optional(),
  date: z.date(),
});

export type FormAnalytics = z.infer<typeof FormAnalyticsSchema>;

// ============================================================================
// BADGE / ACHIEVEMENT
// ============================================================================

export const BadgeTypeEnum = z.enum([
  "first_form",
  "ten_forms",
  "hundred_submissions",
  "theme_creator",
  "community_star",
  "streak_7",
  "streak_30",
  "top_creator",
  "early_adopter",
  "marketplace_seller",
]);

export type BadgeType = z.infer<typeof BadgeTypeEnum>;

export const BadgeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  badgeType: BadgeTypeEnum,
  name: z.string(),
  description: z.string(),
  earnedAt: z.date(),
});

export type Badge = z.infer<typeof BadgeSchema>;

// ============================================================================
// API INPUT/OUTPUT SCHEMAS
// ============================================================================

export const CreateFormInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  layoutType: LayoutTypeEnum.optional(),
  themeId: z.string().uuid().optional(),
});

export type CreateFormInput = z.infer<typeof CreateFormInputSchema>;

export const UpdateFormInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  layoutType: LayoutTypeEnum.optional(),
  themeId: z.string().uuid().optional(),
  settings: FormSettingsSchema.optional(),
  status: FormStatusEnum.optional(),
});

export type UpdateFormInput = z.infer<typeof UpdateFormInputSchema>;

export const CreateFieldInputSchema = z.object({
  formId: z.string().uuid(),
  type: FieldTypeEnum,
  label: z.string().min(1),
  description: z.string().optional(),
  order: z.number(),
  required: z.boolean().optional(),
  config: FieldConfigSchema.optional(),
  validation: FieldValidationSchema.optional(),
  width: z.enum(["full", "half", "third"]).optional(),
});

export type CreateFieldInput = z.infer<typeof CreateFieldInputSchema>;

export const UpdateFieldInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  required: z.boolean().optional(),
  config: FieldConfigSchema.optional(),
  validation: FieldValidationSchema.optional(),
  conditionalLogic: ConditionalLogicSchema.optional(),
  width: z.enum(["full", "half", "third"]).optional(),
});

export type UpdateFieldInput = z.infer<typeof UpdateFieldInputSchema>;

export const CreateSubmissionInputSchema = z.object({
  formId: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      country: z.string().optional(),
      device: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;

// ============================================================================
// ADMIN TYPES
// ============================================================================

export const AdminStatsSchema = z.object({
  totalUsers: z.number(),
  totalForms: z.number(),
  totalSubmissions: z.number(),
  activeForms: z.number(),
  totalThemes: z.number(),
  newUsersToday: z.number(),
  submissionsToday: z.number(),
  formsCreatedToday: z.number(),
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;
