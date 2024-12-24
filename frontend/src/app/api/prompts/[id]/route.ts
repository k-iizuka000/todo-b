import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GETリクエストハンドラ - 特定のプロンプトを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        likes: true,
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCHリクエストハンドラ - プロンプトを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // プロンプトの作成者のみが更新可能
    if (prompt.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags,
        category: body.category,
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETEリクエストハンドラ - プロンプトを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // プロンプトの作成者または管理者のみが削除可能
    if (prompt.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.prompt.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Prompt deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}