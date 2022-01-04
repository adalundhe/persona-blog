-- CreateTable
CREATE TABLE "BlogUser" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "BlogUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" BOOLEAN NOT NULL DEFAULT false,
    "authorId" UUID NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogProfile" (
    "id" UUID NOT NULL,
    "bio" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "BlogProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogUser_email_key" ON "BlogUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogProfile_userId_key" ON "BlogProfile"("userId");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogProfile" ADD CONSTRAINT "BlogProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BlogUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
