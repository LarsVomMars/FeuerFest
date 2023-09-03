import db from "$lib/db";

export const getSessionByToken = async (token: string) => {
    const session = db
        .selectFrom("UserSession")
        .where("token", "=", token)
        // Use inner join, if user is deleted, session is deleted too
        .innerJoin("User", "User.id", "UserSession.userId")
        .selectAll()
        .executeTakeFirst();
    return session;
};

export const deleteSessionById = (sessionId: number) =>
    db.deleteFrom("UserSession").where("id", "=", sessionId).execute();

export const deleteSessionByToken = (token: string) =>
    db.deleteFrom("UserSession").where("token", "=", token).execute();

export const createUserSession = async (
    sessionToken: string,
    userId: number,
    expiresAt: Date,
) => {
    await db
        .insertInto("UserSession")
        .values({
            token: sessionToken,
            userId: userId,
            expiresAt: expiresAt,
        })
        .execute();

    return await getSessionByToken(sessionToken);
};
