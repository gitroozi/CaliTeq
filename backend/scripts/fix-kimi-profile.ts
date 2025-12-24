import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixKimiProfile() {
  try {
    console.log('Finding Kimi\'s user...');

    const user = await prisma.user.findFirst({
      where: {
        email: 'kimiasaadat@hotmail.com',
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    if (user.profile) {
      console.log('Existing profile found, deleting it...');
      await prisma.userProfile.delete({
        where: { id: user.profile.id },
      });
      console.log('Profile deleted successfully');
    } else {
      console.log('No existing profile found');
    }

    console.log('User can now create a new profile through onboarding');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixKimiProfile();
