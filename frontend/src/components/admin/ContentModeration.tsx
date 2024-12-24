import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { api } from '../../services/api';

interface Content {
  id: string;
  type: 'prompt' | 'comment';
  content: string;
  userId: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reportCount: number;
}

const ContentModeration: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // コンテンツの取得
  useEffect(() => {
    fetchContents();
  }, [filterStatus]);

  const fetchContents = async () => {
    try {
      const response = await api.get(`/admin/moderation?status=${filterStatus}`);
      setContents(response.data);
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'コンテンツの取得に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // コンテンツの承認
  const handleApprove = async (contentId: string) => {
    try {
      await api.put(`/admin/moderation/${contentId}/approve`);
      await fetchContents();
      toast({
        title: '承認完了',
        description: 'コンテンツを承認しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: '承認処理に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // コンテンツの拒否
  const handleReject = async (contentId: string) => {
    try {
      await api.put(`/admin/moderation/${contentId}/reject`);
      await fetchContents();
      toast({
        title: '拒否完了',
        description: 'コンテンツを拒否しました',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: '拒否処理に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // 詳細表示
  const handleViewDetails = (content: Content) => {
    setSelectedContent(content);
    onOpen();
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>コンテンツモデレーション</Text>
      
      <Select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        mb={4}
        width="200px"
      >
        <option value="pending">審査待ち</option>
        <option value="approved">承認済み</option>
        <option value="rejected">拒否済み</option>
      </Select>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>種類</Th>
            <Th>内容</Th>
            <Th>報告数</Th>
            <Th>作成日時</Th>
            <Th>アクション</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contents.map((content) => (
            <Tr key={content.id}>
              <Td>{content.type === 'prompt' ? 'プロンプト' : 'コメント'}</Td>
              <Td>{content.content.substring(0, 50)}...</Td>
              <Td>{content.reportCount}</Td>
              <Td>{new Date(content.createdAt).toLocaleString()}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleViewDetails(content)}
                >
                  詳細
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  mr={2}
                  onClick={() => handleApprove(content.id)}
                  isDisabled={content.status === 'approved'}
                >
                  承認
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleReject(content.id)}
                  isDisabled={content.status === 'rejected'}
                >
                  拒否
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* 詳細モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>コンテンツ詳細</ModalHeader>
          <ModalBody>
            {selectedContent && (
              <>
                <Text fontWeight="bold">種類:</Text>
                <Text mb={2}>{selectedContent.type === 'prompt' ? 'プロンプト' : 'コメント'}</Text>
                <Text fontWeight="bold">内容:</Text>
                <Text mb={2}>{selectedContent.content}</Text>
                <Text fontWeight="bold">報告数:</Text>
                <Text mb={2}>{selectedContent.reportCount}</Text>
                <Text fontWeight="bold">作成日時:</Text>
                <Text>{new Date(selectedContent.createdAt).toLocaleString()}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContentModeration;