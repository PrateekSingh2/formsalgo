// ============================================================================
// DRIZZLE ORM SCHEMA — FormForge Database
// ============================================================================
// All tables for users, forms, fields, submissions, themes, analytics,
// badges, follows, likes, and comments.
// ============================================================================

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  real,
  jsonb,
  date,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// USERS
// ============================================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firebaseUid: text("firebase_uid").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    role: text("role").notNull().default("user"), // user | creator | admin | superadmin
    preferences: jsonb("preferences").default({}),
    xp: integer("xp").notNull().default(0),
    level: integer("level").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_firebase_uid_idx").on(table.firebaseUid),
    index("users_email_idx").on(table.email),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
  themes: many(themes),
  badges: many(badges),
  followers: many(userFollows, { relationName: "following" }),
  following: many(userFollows, { relationName: "follower" }),
  likes: many(likes),
}));

// ============================================================================
// FORMS
// ============================================================================

export const forms = pgTable(
  "forms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    status: text("status").notNull().default("draft"), // draft | published | archived | closed
    themeId: uuid("theme_id").references(() => themes.id),
    settings: jsonb("settings").default({}),
    logicRules: jsonb("logic_rules").default([]),
    layoutType: text("layout_type").notNull().default("single_page"),
    coverImage: text("cover_image"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("forms_user_id_idx").on(table.userId),
    uniqueIndex("forms_slug_idx").on(table.slug),
    index("forms_status_idx").on(table.status),
  ]
);

export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [forms.themeId],
    references: [themes.id],
  }),
  fields: many(formFields),
  submissions: many(submissions),
  analytics: many(formAnalytics),
}));

// ============================================================================
// FORM FIELDS
// ============================================================================

export const formFields = pgTable(
  "form_fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    order: integer("order").notNull().default(0),
    required: boolean("required").notNull().default(false),
    config: jsonb("config").default({}),
    validation: jsonb("validation").default({}),
    conditionalLogic: jsonb("conditional_logic"),
    section: text("section"),
    width: text("width").notNull().default("full"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("form_fields_form_id_idx").on(table.formId),
    index("form_fields_order_idx").on(table.formId, table.order),
  ]
);

export const formFieldsRelations = relations(formFields, ({ one }) => ({
  form: one(forms, {
    fields: [formFields.formId],
    references: [forms.id],
  }),
}));

// ============================================================================
// SUBMISSIONS
// ============================================================================

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    data: jsonb("data").notNull().default({}),
    status: text("status").notNull().default("completed"), // in_progress | completed | abandoned
    metadata: jsonb("metadata").default({}),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("submissions_form_id_idx").on(table.formId),
    index("submissions_status_idx").on(table.status),
    index("submissions_completed_at_idx").on(table.completedAt),
  ]
);

export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
}));

// ============================================================================
// THEMES
// ============================================================================

export const themes = pgTable(
  "themes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorId: uuid("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    colors: jsonb("colors").notNull().default({}),
    typography: jsonb("typography").notNull().default({}),
    spacing: jsonb("spacing").notNull().default({}),
    animations: jsonb("animations").notNull().default({}),
    texture: text("texture").notNull().default("none"),
    backgroundImage: text("background_image"),
    isPublic: boolean("is_public").notNull().default(false),
    isMarketplace: boolean("is_marketplace").notNull().default(false),
    isBuiltIn: boolean("is_built_in").notNull().default(false),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    downloads: integer("downloads").notNull().default(0),
    rating: real("rating").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("themes_creator_id_idx").on(table.creatorId),
    index("themes_is_marketplace_idx").on(table.isMarketplace),
    index("themes_is_built_in_idx").on(table.isBuiltIn),
  ]
);

export const themesRelations = relations(themes, ({ one, many }) => ({
  creator: one(users, {
    fields: [themes.creatorId],
    references: [users.id],
  }),
  forms: many(forms),
}));

// ============================================================================
// FORM ANALYTICS
// ============================================================================

export const formAnalytics = pgTable(
  "form_analytics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    views: integer("views").notNull().default(0),
    starts: integer("starts").notNull().default(0),
    completions: integer("completions").notNull().default(0),
    deviceStats: jsonb("device_stats").default({}),
    countryStats: jsonb("country_stats").default({}),
    fieldDropoff: jsonb("field_dropoff").default({}),
    date: date("date").notNull(),
  },
  (table) => [
    index("form_analytics_form_id_idx").on(table.formId),
    index("form_analytics_date_idx").on(table.date),
    uniqueIndex("form_analytics_form_date_idx").on(table.formId, table.date),
  ]
);

export const formAnalyticsRelations = relations(formAnalytics, ({ one }) => ({
  form: one(forms, {
    fields: [formAnalytics.formId],
    references: [forms.id],
  }),
}));

// ============================================================================
// BADGES
// ============================================================================

export const badges = pgTable(
  "badges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeType: text("badge_type").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => [
    index("badges_user_id_idx").on(table.userId),
    uniqueIndex("badges_user_type_idx").on(table.userId, table.badgeType),
  ]
);

export const badgesRelations = relations(badges, ({ one }) => ({
  user: one(users, {
    fields: [badges.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// USER FOLLOWS
// ============================================================================

export const userFollows = pgTable(
  "user_follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index("user_follows_follower_idx").on(table.followerId),
    index("user_follows_following_idx").on(table.followingId),
  ]
);

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

// ============================================================================
// LIKES (polymorphic — can like forms, themes, comments)
// ============================================================================

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: text("target_type").notNull(), // form | theme | comment
    targetId: uuid("target_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("likes_user_id_idx").on(table.userId),
    index("likes_target_idx").on(table.targetType, table.targetId),
    uniqueIndex("likes_user_target_idx").on(
      table.userId,
      table.targetType,
      table.targetId
    ),
  ]
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// COMMENTS
// ============================================================================

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: text("target_type").notNull(), // form | theme
    targetId: uuid("target_id").notNull(),
    content: text("content").notNull(),
    parentId: uuid("parent_id"), // self-referencing for replies
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_target_idx").on(table.targetType, table.targetId),
    index("comments_user_id_idx").on(table.userId),
    index("comments_parent_id_idx").on(table.parentId),
  ]
);

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// QR PRESETS
// ============================================================================

export const qrPresets = pgTable("qr_presets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  config: jsonb("config").notNull().default({}),
  category: text("category").notNull(), // sketch | neon | corporate | gaming | wedding | etc.
  isBuiltIn: boolean("is_built_in").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
