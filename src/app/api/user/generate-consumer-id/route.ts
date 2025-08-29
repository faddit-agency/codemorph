import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // 랜덤 소비자 아이디 생성 함수
    const generateConsumerId = () => {
      const randomNum = Math.floor(Math.random() * 1000000);
      return `C${randomNum.toString().padStart(6, '0')}`;
    };

    // consumer_id가 없는 사용자들을 찾아서 업데이트
    const { data: usersWithoutId, error: selectError } = await supabase
      .from('users')
      .select('id')
      .is('consumer_id', null);

    if (selectError) {
      console.error('사용자 조회 오류:', selectError);
      return NextResponse.json({ 
        error: '사용자 조회에 실패했습니다.', 
        details: selectError.message,
        code: selectError.code 
      }, { status: 500 });
    }

    if (!usersWithoutId || usersWithoutId.length === 0) {
      return NextResponse.json({ message: '모든 사용자에게 이미 consumer_id가 있습니다.' });
    }

    // 각 사용자에게 고유한 consumer_id 생성
    const updatePromises = usersWithoutId.map(async (user) => {
      const consumerId = generateConsumerId();
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ consumer_id: consumerId })
        .eq('id', user.id);

      if (updateError) {
        console.error(`사용자 ${user.id} 업데이트 오류:`, updateError);
        return { id: user.id, success: false, error: updateError.message };
      }

      return { id: user.id, success: true, consumer_id: consumerId };
    });

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `${successCount}명의 사용자에게 consumer_id를 생성했습니다.`,
      successCount,
      failureCount,
      results
    });

  } catch (error) {
    console.error('Consumer ID 생성 오류:', error);
    return NextResponse.json({ error: 'Consumer ID 생성에 실패했습니다.' }, { status: 500 });
  }
}
