import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 通知の取得
export async function GET() {
  try {
    // セッションの取得と認証チェック
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザーの通知を取得
    const notifications = await prisma.notification.findMany({
      where: {
        userEmail: session.user.email,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        fromUser: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      take: 50 // 最新50件を取得
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 通知を既読にする
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { notificationIds } = await request.json();

    // 指定された通知を既読に更新
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds
        },
        userEmail: session.user.email // セキュリティのため、ユーザー所有の通知のみ更新可能
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 通知の削除
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { notificationIds } = await request.json();

    // 指定された通知を削除
    await prisma.notification.deleteMany({
      where: {
        id: {
          in: notificationIds
        },
        userEmail: session.user.email // セキュリティのため、ユーザー所有の通知のみ削除可能
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}