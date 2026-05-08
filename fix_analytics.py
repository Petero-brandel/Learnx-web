import os

path = '/home/kaielix/PROJECTS-WEB/LearnX/backend/dashboard/analytics.py'
with open(path, 'r') as f:
    content = f.read()

# Revenue replacement
old_rev = """        # Revenue over time (Last 30 days)
        thirty_days_ago = today_start - timedelta(days=30)
        revenue_over_time = list(successful_payments.filter(created_at__gte=thirty_days_ago)
            .extra(select={'day': 'date(created_at)'})
            .values('day')
            .annotate(total=Sum('amount'))
            .order_by('day'))"""

new_rev = """        # Revenue over time
        period = request.query_params.get('period', '7d')
        if period == '1y':
            start_date = today_start - timedelta(days=365)
            from django.db.models.functions import TruncMonth
            rev_qs = list(successful_payments.filter(created_at__gte=start_date)
                .annotate(month=TruncMonth('created_at'))
                .values('month')
                .annotate(total=Sum('amount'))
                .order_by('month'))
            
            revenue_over_time = []
            for item in rev_qs:
                if item['month']:
                    revenue_over_time.append({
                        'day': item['month'].strftime('%Y-%m-%d'),
                        'total': item['total']
                    })
        else:
            days_map = {'7d': 7, '14d': 14, '30d': 30}
            days = days_map.get(period, 7)
            start_date = today_start - timedelta(days=days-1)
            revenue_over_time = list(successful_payments.filter(created_at__gte=start_date)
                .extra(select={'day': 'date(created_at)'})
                .values('day')
                .annotate(total=Sum('amount'))
                .order_by('day'))"""

content = content.replace(old_rev, new_rev)

old_usr = """        # Signups over time (Last 30 days)
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        thirty_days_ago = today_start - timedelta(days=30)
        
        signups_over_time = list(User.objects.filter(date_joined__gte=thirty_days_ago)
            .extra(select={'day': 'date(date_joined)'})
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day'))"""

new_usr = """        # Signups over time
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        period = request.query_params.get('period', '7d')
        
        if period == '1y':
            start_date = today_start - timedelta(days=365)
            from django.db.models.functions import TruncMonth
            signups_qs = list(User.objects.filter(date_joined__gte=start_date)
                .annotate(month=TruncMonth('date_joined'))
                .values('month')
                .annotate(count=Count('id'))
                .order_by('month'))
            
            signups_over_time = []
            for item in signups_qs:
                if item['month']:
                    signups_over_time.append({
                        'day': item['month'].strftime('%Y-%m-%d'),
                        'count': item['count']
                    })
        else:
            days_map = {'7d': 7, '14d': 14, '30d': 30}
            days = days_map.get(period, 7)
            start_date = today_start - timedelta(days=days-1)
            
            signups_over_time = list(User.objects.filter(date_joined__gte=start_date)
                .extra(select={'day': 'date(date_joined)'})
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day'))"""

content = content.replace(old_usr, new_usr)

with open(path, 'w') as f:
    f.write(content)
print("Done backend")
